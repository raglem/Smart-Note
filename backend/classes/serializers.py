import json
from rest_framework import serializers
from users.models import Member
from users.serializers import SimpleMemberSerializer
from .models import Class, Unit, Subunit, FileCategory, File
from django.db import transaction
from django.utils import timezone

# This serializer is used to serialize the File model
class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'file', 'name', 'updated_at']
        read_only_fields = ['id', 'updated_at']

    def validate(self, attrs):
        # Validate that the file name is unique within the category
        if File.objects.filter(name=attrs['name'], category=attrs['category']).exists():
            raise serializers.ValidationError("File name must be unique within the Category.")
        
        return super().validate(attrs)

    def update(self, instance, validated_data):
        validated_data['updated_at'] = timezone.now()
        return super().update(instance, validated_data)

# This serializer is used to create a File providing the section_id and section_type
class FileCreateSerializer(serializers.ModelSerializer):
    section_type = serializers.CharField(write_only=True)
    section_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = File
        fields = ['id', 'name', 'file', 'section_id', 'section_type', 'updated_at']
        read_only_fields = ['id', 'updated_at']

    def create(self, validated_data):
        # Retrieve file category
        section_type = validated_data.pop('section_type')
        section_id = validated_data.pop('section_id')

        print(section_id)
        print(section_type)

        # Determine category
        try:
            if section_type == "Class":
                category = FileCategory.objects.get(class_field=section_id)
            elif section_type == "Unit":
                category = FileCategory.objects.get(unit=section_id)
            elif section_type == "Subunit":
                category = FileCategory.objects.get(subunit=section_id)
            else:
                raise serializers.ValidationError("Invalid section_type")
        except FileCategory.DoesNotExist:
            raise serializers.ValidationError("Category not found")

        owner = self.context['request'].user.member

        # Validate that the file name is unique within the category
        if File.objects.filter(name=validated_data['name'], category=category).exists():
             raise serializers.ValidationError("File name must be unique within the Category.")

        return File.objects.create(
            name=validated_data['name'],
            file=validated_data['file'],
            owner=owner,
            category=category
        )
    
class BulkFileCreateSerializer(serializers.Serializer):
    files = FileCreateSerializer(many=True, read_only=True)

    class Meta:
        fields = ['files']

    def create(self, validated_data):
        for file_data in validated_data.pop('files', []):
            # Retrieve file category
            section_type = file_data.pop('section_type')
            section_id = file_data.pop('section_id')

            # Determine category
            try:
                if section_type == "Class":
                    category = FileCategory.objects.get(class_field=section_id)
                elif section_type == "Unit":
                    category = FileCategory.objects.get(unit=section_id)
                elif section_type == "Subunit":
                    category = FileCategory.objects.get(subunit=section_id)
                else:
                    raise serializers.ValidationError("Invalid section_type")
            except FileCategory.DoesNotExist:
                raise serializers.ValidationError("Category not found")

            # Todo: Replace dummy user
            owner = Member.objects.get(name="test_user1")

            return File.objects.create(
                name=file_data['name'],
                file=file_data['file'],
                owner=owner,
                category=category
            )
    
# This serializer is used to serialize the FileCategory model. 
# To create/update a file with a foreign key relationship with a FileCategory object, use the FileSerializer
class FileCategorySerializer(serializers.ModelSerializer):
    files = FileSerializer(many=True)
    section_id = serializers.SerializerMethodField()
    class Meta:
        model = FileCategory
        fields = ['id', 'name', 'section_choice', 'section_id', 'files']
        read_only_fields = ['id', 'files']

    # This method is used to get the section_id based on the section_choice being either Class, Unit, or Subunit
    def get_section_id(self, obj):
        if obj.section_choice == "Class" and obj.class_field is not None:
            return obj.class_field.id
        elif obj.section_choice == "Unit" and obj.unit is not None:
            return obj.unit.id
        elif obj.section_choice == "Subunit" and obj.subunit is not None:
            return obj.subunit.id
        return None
    
# This serializer is used as a nested serializer when there is no need to include the unit (the UnitSubunitSerializer and create operations)
class SubunitNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subunit
        fields = ['id', 'name', 'order']
        read_only_fields = ['id']

# This serializer returns information of the subunit along with its unit
class SubunitSerializerFull(serializers.ModelSerializer):
    files = serializers.SerializerMethodField()
    class Meta:
        model = Subunit
        fields = ['id', 'name', 'order', 'unit', 'files']
        read_only_fields = ['id']

    def get_files(self, obj):
        category = obj.category
        files = FileSerializer(category.files, many=True).data
        return sorted(files, key=lambda x: x['id'])
    
# This serializer is used to serialize the Unit model
class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ['id', 'name', 'order', 'class_field']
        read_only_fields = ['id']

# This serializer is used to serialize the Unit model for a POST or PUT request
# The class_field should be included in the validated data
class UnitCreateSerializer(serializers.ModelSerializer):
    subunits = SubunitNestedSerializer(many=True)
    class Meta:
        model = Unit
        fields = ['id', 'name', 'order', 'class_field', 'subunits']
        read_only_fields = ['id']

    def create(self, validated_data):
        class_field = validated_data.pop('class_field')
        subunits_data = validated_data.pop('subunits', [])

        with transaction.atomic():
            # Create the unit instance
            unit = Unit.objects.create(class_field=class_field, **validated_data)

            # Create subunits and associate them with the unit
            for subunit_data in subunits_data:
                Subunit.objects.create(unit=unit, **subunit_data)
        
        return unit

    def update(self, instance, validated_data):
        subunits_data = validated_data.pop('subunits', [])

        with transaction.atomic():
            # Delete all existing subunits
            instance.subunits.all().delete()

            # Update the unit instance, without the subunits
            unit = super().update(instance, validated_data)

            # Create new subunits
            for subunit_data in subunits_data:
                Subunit.objects.create(unit=unit, **subunit_data)

        return unit

# This serializer is used to serialize the Unit model when creating from the ClassCreateSerializer
class UnitCreateSerializerWithoutClass(serializers.ModelSerializer):
    subunits = SubunitNestedSerializer(many=True)
    class Meta:
        model = Unit
        fields = ['id', 'name', 'order', 'subunits']
    
# This serializer is used as a nested serializer for the ClassUnitSubunitSerializer
class UnitSubunitSerializer(serializers.ModelSerializer):
    subunits = SubunitNestedSerializer(many=True, read_only=True)

    class Meta:
        model = Unit
        fields = ['id', 'name', 'order', 'subunits']
        read_only_fields = ['id']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["subunits"] = sorted(response["subunits"], key=lambda x: x["order"])
        return response

# This serializer includes the subunits full information (including the unit) within the unit serializer
class UnitSubunitSerializerFull(serializers.ModelSerializer):
    subunits = SubunitSerializerFull(many=True)
    files = serializers.SerializerMethodField()

    class Meta:
        model = Unit
        fields = ['id', 'name', 'order', 'subunits', 'files']
        read_only_fields = ['id']

    def get_files(self, obj):
        category = obj.category
        files = FileSerializer(category.files, many=True).data
        return sorted(files, key=lambda x: x['id'])
        
# This serializer is used to serialize and represent parts of the Class model
class ClassSerializer(serializers.ModelSerializer):
    owner = SimpleMemberSerializer()
    members = SimpleMemberSerializer(many=True, read_only=True)
    units = UnitSerializer(many=True, read_only=True)
    number_of_files = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = [
            'id', 'name', 'image', 'course_number', 
            'owner', 'members', 'units', 'join_code',
            'number_of_files'
        ]
        read_only_fields = ['id']
    
    def get_number_of_files(self, obj):
        category = FileCategory.objects.get(class_field=obj)
        return category.files.count()

# This serializer is used to serializer the Class model for a POST request
class ClassCreateSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(queryset=Member.objects.all(), many=True, required=False)
    units = UnitCreateSerializerWithoutClass(many=True, required=False)

    class Meta:
        model = Class
        fields = ['id', 'name', 'image', 'course_number', 'members', 'units']
        read_only_fields = ['id']
    
    def create(self, validated_data):
        units = validated_data.pop('units', [])
        members = validated_data.pop('members', [])
        owner = self.context['request'].user.member

        with transaction.atomic():
            new_class = Class.objects.create(owner=owner, **validated_data)
            # Create units and associate them with the class
            for unit in units:
                Unit.objects.create(class_field=new_class, **unit)
            # Associate members with the class
            new_class.members.set(members)
        return new_class

    def update(self, instance, validated_data):
        # Units will not be updated in this serializer. Use UnitCreateSerializer instead
        validated_data.pop('units', [])
        members = validated_data.pop('members', [])

        with transaction.atomic():
            new_class = super().update(instance, validated_data)
            # Associate members with the class
            new_class.members.set(members)

        return new_class

# This serializer returns information of the class along with its units and subunits
class ClassUnitSubunitSerializer(serializers.ModelSerializer):
    units = UnitSubunitSerializer(many=True, read_only=True)
    members = SimpleMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Class
        fields = ['id', 'name', 'course_number', 'units', 'members']
        read_only_fields = ['id']

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["units"] = sorted(response["units"], key=lambda x: x["order"])
        
        return response

# This serializer is used to display/edit the full information of the class, including the nested unit and subunit
class ClassUnitSubunitSerializerFull(serializers.ModelSerializer):
    owner = SimpleMemberSerializer(read_only=True)
    members = SimpleMemberSerializer(many=True, read_only=True)
    units = UnitSubunitSerializerFull(many=True, read_only=True)
    files = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Class
        fields = [
            'id', 'name', 'course_number', 
            'join_code', 'owner', 'members',
            'units', 'files'
        ]
        read_only_fields = ['id', 'owner', 'files', 'join_code']

    def get_files(self, obj):
        category = obj.category
        files = FileSerializer(category.files, many=True).data
        return sorted(files, key=lambda x: x['name'])

    # Handle PUT request
    # Frontend will send back entire class. This function will determine what fields have changed and how to handle the update
    def update(self, instance, validated_data):
        original_class = Class.objects.get(id=instance.id)

        # Check if any class fields were changed
        if validated_data.get('name') != original_class.name:
            original_class.name = validated_data.get('name')
        if validated_data.get('course_number') != original_class.course_number:
            original_class.course_number = validated_data.get('course_number')

        # Change the units
        units = self.initial_data.pop('units', [])

        # DELETE UNITS: Check for any units in the original class that were not included in the request body
        unit_ids = [unit['id'] for unit in units if 'id' in unit]
        deleted_units = original_class.units.exclude(id__in=unit_ids)
        deleted_units.delete()

        for unit in units:
            subunits = unit.pop('subunits', [])

            # DELETE SUBUNITS: Check for any subunits in the original unit that were not included in the request body
            if(unit.get('id') is not None):
                original_unit = original_class.units.get(id=unit['id'])
                if original_unit:
                    subunit_ids = [subunit['id'] for subunit in subunits if 'id' in subunit]
                    deleted_subunits = original_unit.subunits.exclude(id__in=subunit_ids)
                    deleted_subunits.delete()

            # CREATE UNIT: Check if the unit is new
            if(unit.get('id') is None):
                new_unit = Unit.objects.create(class_field=original_class, **unit)

                # CREATE SUBUNITS: Check if subunits were included
                for subunit in subunits:
                    new_subunit = Subunit.objects.create(unit=new_unit, **subunit)
                continue
        
            # UPDATE UNIT: Check if the unit has been modified
            original_unit = original_class.units.get(id=unit['id'])
            if original_unit is None:
                continue

            # Check if any unit fields were changed
            if unit['name'] != original_unit.name:
                original_unit.name = unit['name']
            if unit['order'] != original_unit.order:
                original_unit.order = unit['order']

            for subunit in subunits:
                # CREATE SUBUNIT: Check if the subunit is new
                if subunit.get('id') is None:
                    Subunit.objects.create(unit=original_unit, **subunit)
                    continue
                
                # UPDATE SUBUNIT
                original_subunit = original_unit.subunits.get(id=subunit['id'])
                if original_subunit is None:
                    continue

                # Check if any subunit fields were changed
                if subunit['name'] != original_subunit.name:
                    original_subunit.name = subunit['name']
                if subunit['order'] != original_subunit.order:
                    original_subunit.order = subunit['order']

                original_subunit.save()

            original_unit.save()

        original_class.save()
        return original_class
