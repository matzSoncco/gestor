from django.urls import path
from . import views

urlpatterns = [
    path('form-submit/', views.form_submit, name='form_submit'),
    path('csv-upload/', views.csv_upload, name='csv_upload'),
    path('report-generate/', views.report_generate, name='report_generate'),
]