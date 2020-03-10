from django.contrib.auth.models import AbstractUser
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    # First Name and Last Name do not cover name patterns around the globe.
    name = models.CharField(_("User's name"), blank=True, max_length=255)
    picture = models.ImageField(
        _("Profile picture"), upload_to="profile_pics/", null=True, blank=True
    )
    short_bio = models.CharField(
        _("Describe yourself"), max_length=60, blank=True, null=True
    )
    bio = models.CharField(_("Short bio"), max_length=280, blank=True, null=True)

    def __str__(self):
        return self.username

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    def get_profile_name(self):
        if self.name:
            return self.name

        return self.username
