import random
import string
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from users.models import Member

class Class(models.Model):
    name = models.CharField(max_length=50)
    course_number = models.CharField(max_length=50, null=True, blank=True)
    join_code = models.CharField(max_length=8, blank=True, unique=True)
    owner = models.ForeignKey(Member, on_delete=models.SET_NULL, related_name='owned_classes', null=True, blank=True)
    members = models.ManyToManyField(Member, related_name='classes', blank=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        is_new = self.pk is None

        if not self.join_code:
            self.join_code = self._generate_join_code()

        self.clean()
        super().save(*args, **kwargs)

        if is_new:
            FileCategory.objects.create(section_choice="Class", class_field=self)

    def _generate_join_code(self):
        while True:
            join_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            if not Class.objects.filter(join_code=join_code).exists():
                return join_code

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
        is_new = self.pk is None

        self.clean()
        super().save(*args, **kwargs)

        if is_new:
            FileCategory.objects.create(section_choice="Unit", unit=self)
        
    def __str__(self):
        return f"{self.name} - {self.class_field.name}"

class Subunit(models.Model):
    name = models.CharField(max_length=50)
    order = models.PositiveIntegerField()
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='subunits')

    # def clean(self):
    #     # the subunit name is not unique within the unit
    #     if Subunit.objects.filter(name=self.name, unit=self.unit).exists():
    #         raise ValidationError("SubUnit name must be unique within the Unit.")

    #     # the order is not unique within the unit
    #     if Subunit.objects.filter(order=self.order, unit=self.unit).exists():
    #         raise ValidationError("SubUnit must be unique within the Class.")
        
    def save(self, *args, **kwargs):
        is_new = self.pk is None

        self.clean()
        super().save(*args, **kwargs)

        if is_new:
            FileCategory.objects.create(section_choice="Subunit", subunit=self)

    def __str__(self):
        return f"{self.name} - {self.unit.name} - {self.unit.class_field.name}"
    
class FileCategory(models.Model):
    SECTION_CHOICES = [
        ("Class", "Class"),
        ("Unit", "Unit"),
        ("Subunit", "Subunit"),
    ]
    section_choice = models.CharField(max_length=50, choices=SECTION_CHOICES)
    class_field = models.OneToOneField(Class, on_delete=models.CASCADE, related_name='category', null=True, blank=True)
    unit = models.OneToOneField(Unit, on_delete=models.CASCADE, related_name='category', null=True, blank=True)
    subunit = models.OneToOneField(Subunit, on_delete=models.CASCADE, related_name='category', null=True, blank=True)

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

    def __str__(self):
        if self.section_choice == "Class":
            return f"File Category | Class {self.class_field}"
        elif self.section_choice == "Unit":
            return f"File Category | Unit {self.unit}"
        elif self.section_choice == "Subunit":
            return f"File Category | Subunit {self.subunit}"
        
class File(models.Model):
    name = models.CharField(max_length=50)
    file = models.FileField(upload_to='')
    owner = models.ForeignKey(Member, on_delete=models.SET_NULL, related_name='files', null=True, blank=True)
    category = models.ForeignKey(FileCategory, on_delete=models.CASCADE, related_name='files')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def clean(self):
        # Validate that the file name is unique within the category
        if File.objects.filter(name=self.name, category=self.category).exists():
            raise ValidationError("File name must be unique within the Category.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.file.delete(save=False)
        super().delete(*args, **kwargs)
    