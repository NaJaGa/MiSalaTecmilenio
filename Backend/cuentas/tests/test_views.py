import json
import pytest
from django.urls import reverse
from rest_framework import status

@pytest.mark.django_db
def test_user_registration(client):
    url = reverse('register-user')
    data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password1": "Test1234",
        "password2": "Test1234",
    }

    response = client.post(url, data=json.dumps(data), content_type='application/json')

    assert response.status_code == status.HTTP_201_CREATED
    assert 'tokens' in response.data

@pytest.mark.django_db
def test_user_login(client):
    register_url = reverse('register-user')
    login_url = reverse('login-user')

    # Primero registramos
    register_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password1": "Test1234",
        "password2": "Test1234",
    }
    client.post(register_url, data=json.dumps(register_data), content_type='application/json')

    # Luego intentamos login
    login_data = {
        "email": "testuser@example.com",
        "password": "Test1234",
    }
    response = client.post(login_url, data=json.dumps(login_data), content_type='application/json')

    assert response.status_code == status.HTTP_200_OK
    assert 'tokens' in response.data

@pytest.mark.django_db
@pytest.mark.django_db
def test_user_logout(client):
    register_url = reverse('register-user')
    login_url = reverse('login-user')
    logout_url = reverse('logout-user')

    register_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password1": "Test1234",
        "password2": "Test1234",
    }
    client.post(register_url, data=json.dumps(register_data), content_type='application/json')

    login_data = {
        "email": "testuser@example.com",
        "password": "Test1234",
    }
    login_response = client.post(login_url, data=json.dumps(login_data), content_type='application/json')

    refresh_token = login_response.data['tokens']['refresh']
    access_token = login_response.data['tokens']['access']

    logout_data = {
        "refresh": refresh_token,
    }

    # Envía el token access en el header Authorization
    response = client.post(
        logout_url,
        data=json.dumps(logout_data),
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {access_token}'
    )

    assert response.status_code == status.HTTP_205_RESET_CONTENT


@pytest.mark.django_db
def test_user_info(client):
    register_url = reverse('register-user')
    login_url = reverse('login-user')
    user_info_url = reverse('user-info')

    register_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password1": "Test1234",
        "password2": "Test1234",
    }
    client.post(register_url, data=json.dumps(register_data), content_type='application/json')

    login_data = {
        "email": "testuser@example.com",
        "password": "Test1234",
    }
    login_response = client.post(login_url, data=json.dumps(login_data), content_type='application/json')

    access_token = login_response.data['tokens']['access']

    # Para solicitar user info necesitas autenticación con token Bearer
    client.defaults['HTTP_AUTHORIZATION'] = f'Bearer {access_token}'

    response = client.get(user_info_url)

    assert response.status_code == status.HTTP_200_OK
    assert response.data['username'] == 'testuser'
    assert response.data['email'] == 'testuser@example.com'
