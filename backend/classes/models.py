from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from users.models import Member

class Class(models.Model):
    name = models.CharField(max_length=50)
    course_number = models.CharField(max_length=50, null=True, blank=True)
    owner = models.ForeignKey(Member, on_delete=models.SET_NULL, related_name='owned_classes', null=True, blank=True)
    members = models.ManyToManyField(Member, related_name='classes', blank=True)

    def __str__(self):
        return self.name

class Unit(models.Model):
    name = models.CharField(max_length=50)
    order = models.PositiveIntegerField()
    class_field = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='units')

    def create(self):
        # the name is not unique within the class
        if Unit.objects.filter(name=self.name, class_field=self.class_field):
            raise ValidationError("Unit name must be unique within the Class.")

        # the order is not unique within the class
        if Unit.objects.filter(order=self.order, class_field=self.class_field).exists():
            raise ValidationError("Order must be unique within the Class.")
        
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.name} - {self.class_field.name}"

class Subunit(models.Model):
    name = models.CharField(max_length=50)
    order = models.PositiveIntegerField()
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='subunits')

    def clean(self):
        # the subunit name is not unique within the unit
        if Subunit.objects.filter(name=self.name, unit=self.unit).exists():
            raise ValidationError("SubUnit name must be unique within the Unit.")

        # the order is not unique within the unit
        if Subunit.objects.filter(order=self.order, unit=self.unit).exists():
            raise ValidationError("SubUnit must be unique within the Class.")
        
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.unit.name} - {self.unit.class_field.name}"
    
class FileCategory(models.Model):
    SECTION_CHOICES = [
        ("Class", "Class"),
        ("Unit", "Unit"),
        ("Subunit", "Subunit"),
    ]
    name = models.CharField(max_length=50)
    section_choice = models.CharField(max_length=50, choices=SECTION_CHOICES)
    class_field = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='file_categories', null=True, blank=True)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='file_categories', null=True, blank=True)
    subunit = models.ForeignKey(Subunit, on_delete=models.CASCADE, related_name='file_categories', null=True, blank=True)

    def clean(self):
        # Validate that the section_choice is valid
        if self.section_choice == "Class" and self.class_field is None:
            raise ValidationError("The selected Class is not specified or does not exist.")
        elif self.section_choice == "Unit" and self.unit is None:
            raise ValidationError("The selected Unit is not specified or does not exist.")
        elif self.section_choice == "Subunit" and self.subunit is None:
            raise ValidationError("The selected Subunit is not specified or does not exist.")
        
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
class File(models.Model):
    name = models.CharField(max_length=50)
    file = models.FileField(upload_to='media/')
    owner = models.ForeignKey(Member, on_delete=models.SET_NULL, related_name='files', null=True, blank=True)
    category = models.ForeignKey(FileCategory, on_delete=models.CASCADE, related_name='files')
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Validate that the file name is unique within the category
        if File.objects.filter(name=self.name, category=self.category).exists():
            raise ValidationError("File name must be unique within the Category.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    