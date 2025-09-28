import pytest
from cuentas.serializers import UserRegistrationSerializer, UserLoginSerializer, CustomUserSerializer
from cuentas.models import CustomUser
from django.contrib.auth import authenticate

@pytest.mark.django_db
def test_user_registration_serializer_valid():
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password1": "Test1234",
        "password2": "Test1234",
    }
    serializer = UserRegistrationSerializer(data=data)
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()
    assert user.username == data["username"]
    assert user.email == data["email"]
    assert user.check_password(data["password1"])

@pytest.mark.django_db
def test_user_registration_serializer_password_mismatch():
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password1": "Test1234",
        "password2": "Mismatch1234",
    }
    serializer = UserRegistrationSerializer(data=data)
    assert not serializer.is_valid()
    assert "password" in serializer.errors

@pytest.mark.django_db
def test_user_registration_serializer_password_too_short():
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password1": "short",
        "password2": "short",
    }
    serializer = UserRegistrationSerializer(data=data)
    assert not serializer.is_valid()
    assert "password" in serializer.errors

@pytest.mark.django_db
def test_user_login_serializer_valid():
    # Crear usuario manualmente
    user = CustomUser.objects.create_user(
        username='testuser',
        email='testuser@example.com',
        password='Test1234'
    )

    data = {
        'email': 'testuser@example.com',
        'password': 'Test1234'
    }
    serializer = UserLoginSerializer(data=data)
    assert serializer.is_valid()
    assert serializer.validated_data == user
    
@pytest.mark.django_db
def test_user_login_serializer_invalid():
    data = {"email": "nonexistent@example.com", "password": "wrongpass"}
    serializer = UserLoginSerializer(data=data)
    assert not serializer.is_valid()

def test_custom_user_serializer():
    user = CustomUser(id=1, username="testuser", email="testuser@example.com")
    serializer = CustomUserSerializer(user)
    data = serializer.data
    assert data["id"] == 1
    assert data["username"] == "testuser"
    assert data["email"] == "testuser@example.com"
