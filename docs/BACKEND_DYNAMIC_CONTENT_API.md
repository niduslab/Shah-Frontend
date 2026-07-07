# Backend API Implementation Guide - Dynamic Content System

## Overview
This document provides the complete backend implementation for the dynamic content management system using Django REST Framework.

## 1. Django Models

### File: `backend/apps/content/models.py`

```python
from django.db import models
from django.utils.text import slugify
from django.core.validators import URLValidator


class DynamicPage(models.Model):
    """Model for storing dynamic page metadata"""
    
    PAGE_TYPE_CHOICES = [
        ('landing', 'Landing Page'),
        ('brand', 'Brand Page'),
    ]
    
    page_type = models.CharField(max_length=50, choices=PAGE_TYPE_CHOICES)
    page_key = models.CharField(max_length=100, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, null=True, blank=True)
    meta_title = models.CharField(max_length=255, null=True, blank=True)
    meta_description = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'dynamic_pages'
        ordering = ['page_type', 'page_key']
        indexes = [
            models.Index(fields=['page_type']),
            models.Index(fields=['page_key']),
            models.Index(fields=['slug']),
        ]
    
    def __str__(self):
        return f"{self.page_type} - {self.title}"
    
    def save(self, *args, **kwargs):
        if not self.slug and self.page_type == 'brand':
            self.slug = slugify(self.page_key)
        super().save(*args, **kwargs)


class PageSection(models.Model):
    """Model for storing page sections"""
    
    page = models.ForeignKey(
        DynamicPage,
        on_delete=models.CASCADE,
        related_name='sections'
    )
    section_type = models.CharField(max_length=100, db_index=True)
    section_key = models.CharField(max_length=100)
    title = models.CharField(max_length=500, null=True, blank=True)
    subtitle = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    button_text = models.CharField(max_length=100, null=True, blank=True)
    button_url = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        validators=[URLValidator()]
    )
    display_order = models.IntegerField(default=0)
    is_enabled = models.BooleanField(default=True)
    config = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'page_sections'
        ordering = ['display_order', 'id']
        unique_together = [['page', 'section_type', 'section_key']]
        indexes = [
            models.Index(fields=['page', 'section_type']),
            models.Index(fields=['display_order']),
        ]
    
    def __str__(self):
        return f"{self.page.title} - {self.section_type} ({self.section_key})"


class SectionImage(models.Model):
    """Model for storing section images"""
    
    IMAGE_TYPE_CHOICES = [
        ('main', 'Main Image'),
        ('grid', 'Grid Image'),
        ('background', 'Background Image'),
        ('thumbnail', 'Thumbnail'),
    ]
    
    section = models.ForeignKey(
        PageSection,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image_url = models.CharField(max_length=1000)
    image_alt = models.CharField(max_length=255, null=True, blank=True)
    image_type = models.CharField(
        max_length=50,
        choices=IMAGE_TYPE_CHOICES,
        default='main'
    )
    display_order = models.IntegerField(default=0)
    width = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'section_images'
        ordering = ['display_order', 'id']
        indexes = [
            models.Index(fields=['section', 'image_type']),
            models.Index(fields=['display_order']),
        ]
    
    def __str__(self):
        return f"{self.section.section_type} - {self.image_type}"


class SectionBadge(models.Model):
    """Model for storing section badges"""
    
    BADGE_TYPE_CHOICES = [
        ('discount', 'Discount Badge'),
        ('save', 'Save Badge'),
        ('new', 'New Badge'),
        ('featured', 'Featured Badge'),
    ]
    
    POSITION_CHOICES = [
        ('top-left', 'Top Left'),
        ('top-right', 'Top Right'),
        ('bottom-left', 'Bottom Left'),
        ('bottom-right', 'Bottom Right'),
    ]
    
    section = models.ForeignKey(
        PageSection,
        on_delete=models.CASCADE,
        related_name='badges'
    )
    badge_type = models.CharField(max_length=50, choices=BADGE_TYPE_CHOICES)
    text = models.CharField(max_length=100, null=True, blank=True)
    value = models.CharField(max_length=50, null=True, blank=True)
    position = models.CharField(
        max_length=50,
        choices=POSITION_CHOICES,
        default='top-right'
    )
    background_color = models.CharField(max_length=50, default='#FF5722')
    text_color = models.CharField(max_length=50, default='#FFFFFF')
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'section_badges'
        indexes = [
            models.Index(fields=['section', 'badge_type']),
        ]
    
    def __str__(self):
        return f"{self.section.section_type} - {self.badge_type}"
```

## 2. Django Serializers

### File: `backend/apps/content/serializers.py`

```python
from rest_framework import serializers
from .models import DynamicPage, PageSection, SectionImage, SectionBadge


class SectionBadgeSerializer(serializers.ModelSerializer):
    """Serializer for section badges"""
    
    class Meta:
        model = SectionBadge
        fields = [
            'id', 'badge_type', 'text', 'value', 'position',
            'background_color', 'text_color', 'is_enabled'
        ]


class SectionImageSerializer(serializers.ModelSerializer):
    """Serializer for section images"""
    
    class Meta:
        model = SectionImage
        fields = [
            'id', 'image_url', 'image_alt', 'image_type',
            'display_order', 'width', 'height'
        ]


class PageSectionSerializer(serializers.ModelSerializer):
    """Serializer for page sections with nested images and badges"""
    
    images = SectionImageSerializer(many=True, read_only=True)
    badges = SectionBadgeSerializer(many=True, read_only=True)
    
    class Meta:
        model = PageSection
        fields = [
            'id', 'section_type', 'section_key', 'title', 'subtitle',
            'description', 'button_text', 'button_url', 'display_order',
            'is_enabled', 'config', 'images', 'badges', 'created_at', 'updated_at'
        ]


class PageSectionWriteSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating sections with nested data"""
    
    images = SectionImageSerializer(many=True, required=False)
    badges = SectionBadgeSerializer(many=True, required=False)
    
    class Meta:
        model = PageSection
        fields = [
            'section_type', 'section_key', 'title', 'subtitle',
            'description', 'button_text', 'button_url', 'display_order',
            'is_enabled', 'config', 'images', 'badges'
        ]
    
    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        badges_data = validated_data.pop('badges', [])
        
        section = PageSection.objects.create(**validated_data)
        
        # Create images
        for image_data in images_data:
            SectionImage.objects.create(section=section, **image_data)
        
        # Create badges
        for badge_data in badges_data:
            SectionBadge.objects.create(section=section, **badge_data)
        
        return section
    
    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', None)
        badges_data = validated_data.pop('badges', None)
        
        # Update section fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update images if provided
        if images_data is not None:
            instance.images.all().delete()
            for image_data in images_data:
                SectionImage.objects.create(section=instance, **image_data)
        
        # Update badges if provided
        if badges_data is not None:
            instance.badges.all().delete()
            for badge_data in badges_data:
                SectionBadge.objects.create(section=instance, **badge_data)
        
        return instance


class DynamicPageSerializer(serializers.ModelSerializer):
    """Serializer for dynamic pages"""
    
    sections = PageSectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = DynamicPage
        fields = [
            'id', 'page_type', 'page_key', 'title', 'slug',
            'meta_title', 'meta_description', 'is_active',
            'sections', 'created_at', 'updated_at'
        ]


class DynamicPageListSerializer(serializers.ModelSerializer):
    """Serializer for listing pages without sections"""
    
    sections_count = serializers.SerializerMethodField()
    
    class Meta:
        model = DynamicPage
        fields = [
            'id', 'page_type', 'page_key', 'title', 'slug',
            'is_active', 'sections_count', 'created_at', 'updated_at'
        ]
    
    def get_sections_count(self, obj):
        return obj.sections.count()
```

## 3. Django Views

### File: `backend/apps/content/views.py`

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import DynamicPage, PageSection, SectionImage, SectionBadge
from .serializers import (
    DynamicPageSerializer,
    DynamicPageListSerializer,
    PageSectionSerializer,
    PageSectionWriteSerializer,
)


class DynamicPageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing dynamic pages"""
    
    queryset = DynamicPage.objects.all()
    lookup_field = 'page_key'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return DynamicPageListSerializer
        return DynamicPageSerializer
    
    def get_permissions(self):
        if self.action in ['retrieve_public', 'landing_page', 'brand_page']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def list(self, request):
        """List all pages with optional filtering"""
        queryset = self.get_queryset()
        
        # Filter by page_type
        page_type = request.query_params.get('page_type')
        if page_type:
            queryset = queryset.filter(page_type=page_type)
        
        # Filter by is_active
        is_active = request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        # Pagination
        page = int(request.query_params.get('page', 1))
        limit = int(request.query_params.get('limit', 10))
        start = (page - 1) * limit
        end = start + limit
        
        total = queryset.count()
        pages = queryset[start:end]
        
        serializer = self.get_serializer(pages, many=True)
        
        return Response({
            'success': True,
            'data': {
                'pages': serializer.data,
                'pagination': {
                    'total': total,
                    'page': page,
                    'limit': limit,
                    'total_pages': (total + limit - 1) // limit
                }
            }
        })
    
    def retrieve(self, request, page_key=None):
        """Get page with all sections"""
        page = get_object_or_404(DynamicPage, page_key=page_key)
        serializer = self.get_serializer(page)
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def create(self, request):
        """Create a new page"""
        serializer = DynamicPageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Page created successfully'
        }, status=status.HTTP_201_CREATED)
    
    def update(self, request, page_key=None):
        """Update an existing page"""
        page = get_object_or_404(DynamicPage, page_key=page_key)
        serializer = DynamicPageSerializer(page, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'success': True,
            'data': serializer.data,
            'message': 'Page updated successfully'
        })
    
    def destroy(self, request, page_key=None):
        """Delete a page"""
        page = get_object_or_404(DynamicPage, page_key=page_key)
        page.delete()
        
        return Response({
            'success': True,
            'message': 'Page deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['get'])
    def sections(self, request, page_key=None):
        """Get all sections for a page"""
        page = get_object_or_404(DynamicPage, page_key=page_key)
        sections = page.sections.all()
        
        # Filter by section_type
        section_type = request.query_params.get('section_type')
        if section_type:
            sections = sections.filter(section_type=section_type)
        
        # Filter by is_enabled
        is_enabled = request.query_params.get('is_enabled')
        if is_enabled is not None:
            sections = sections.filter(is_enabled=is_enabled.lower() == 'true')
        
        serializer = PageSectionSerializer(sections, many=True)
        
        return Response({
            'success': True,
            'data': {
                'sections': serializer.data
            }
        })
    
    @action(detail=True, methods=['post'])
    def create_section(self, request, page_key=None):
        """Create a new section for a page"""
        page = get_object_or_404(DynamicPage, page_key=page_key)
        
        serializer = PageSectionWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        section = serializer.save(page=page)
        
        response_serializer = PageSectionSerializer(section)
        
        return Response({
            'success': True,
            'data': response_serializer.data,
            'message': 'Section created successfully'
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['put'], url_path='sections/(?P<section_id>[^/.]+)')
    def update_section(self, request, page_key=None, section_id=None):
        """Update a section"""
        page = get_object_or_404(DynamicPage, page_key=page_key)
        section = get_object_or_404(PageSection, id=section_id, page=page)
        
        serializer = PageSectionWriteSerializer(
            section,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        section = serializer.save()
        
        response_serializer = PageSectionSerializer(section)
        
        return Response({
            'success': True,
            'data': response_serializer.data,
            'message': 'Section updated successfully'
        })
    
    @action(detail=True, methods=['delete'], url_path='sections/(?P<section_id>[^/.]+)')
    def delete_section(self, request, page_key=None, section_id=None):
        """Delete a section"""
        page = get_object_or_404(DynamicPage, page_key=page_key)
        section = get_object_or_404(PageSection, id=section_id, page=page)
        section.delete()
        
        return Response({
            'success': True,
            'message': 'Section deleted successfully'
        }, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'], url_path='sections/reorder')
    def reorder_sections(self, request, page_key=None):
        """Reorder sections"""
        page = get_object_or_404(DynamicPage, page_key=page_key)
        sections_data = request.data.get('sections', [])
        
        with transaction.atomic():
            for section_data in sections_data:
                section_id = section_data.get('id')
                display_order = section_data.get('display_order')
                
                PageSection.objects.filter(
                    id=section_id,
                    page=page
                ).update(display_order=display_order)
        
        return Response({
            'success': True,
            'message': 'Sections reordered successfully'
        })
    
    @action(detail=False, methods=['get'], url_path='public/landing')
    def landing_page(self, request):
        """Public endpoint for landing page content"""
        try:
            page = DynamicPage.objects.get(page_key='home', is_active=True)
            sections = page.sections.filter(is_enabled=True).prefetch_related(
                'images', 'badges'
            )
            
            # Format for frontend compatibility
            hero_sections = []
            pre_order_section = None
            
            for section in sections:
                section_data = PageSectionSerializer(section).data
                
                if section.section_type == 'hero':
                    hero_sections.append(section_data)
                elif section.section_type == 'pre-order':
                    pre_order_section = section_data
            
            return Response({
                'success': True,
                'sections': hero_sections,
                'preOrderSection': pre_order_section
            })
        except DynamicPage.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Landing page not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['get'], url_path='public/brand/(?P<brand_slug>[^/.]+)')
    def brand_page(self, request, brand_slug=None):
        """Public endpoint for brand page content"""
        try:
            page = DynamicPage.objects.get(
                page_type='brand',
                slug=brand_slug,
                is_active=True
            )
            serializer = DynamicPageSerializer(page)
            
            return Response({
                'success': True,
                'data': serializer.data
            })
        except DynamicPage.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Brand page not found'
            }, status=status.HTTP_404_NOT_FOUND)
```

## 4. URL Configuration

### File: `backend/apps/content/urls.py`

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DynamicPageViewSet

router = DefaultRouter()
router.register(r'dynamic-pages', DynamicPageViewSet, basename='dynamic-pages')

urlpatterns = [
    path('', include(router.urls)),
    
    # Public endpoints
    path('hero-sections/', 
         DynamicPageViewSet.as_view({'get': 'landing_page'}),
         name='hero-sections'),
    path('dynamic-content/landing/', 
         DynamicPageViewSet.as_view({'get': 'landing_page'}),
         name='landing-content'),
    path('dynamic-content/brand/<str:brand_slug>/', 
         DynamicPageViewSet.as_view({'get': 'brand_page'}),
         name='brand-content'),
]
```

### File: `backend/config/urls.py` (Add to main URLs)

```python
from django.urls import path, include

urlpatterns = [
    # ... other patterns
    path('api/', include('apps.content.urls')),
    path('api/admin/', include('apps.content.urls')),  # Admin endpoints
]
```

## 5. Database Migration

```bash
# Create migrations
python manage.py makemigrations content

# Apply migrations
python manage.py migrate content
```

## 6. Initial Data Seeding

### File: `backend/apps/content/management/commands/seed_landing_page.py`

```python
from django.core.management.base import BaseCommand
from apps.content.models import DynamicPage, PageSection, SectionImage, SectionBadge


class Command(BaseCommand):
    help = 'Seed landing page with default data'
    
    def handle(self, *args, **kwargs):
        # Create landing page
        page, created = DynamicPage.objects.get_or_create(
            page_key='home',
            defaults={
                'page_type': 'landing',
                'title': 'Home Page',
                'is_active': True
            }
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS('Created landing page'))
        
        # Create hero sections
        hero_sections_data = [
            {
                'section_key': 'main',
                'title': 'Elevate Your\nFitness Journey',
                'button_text': 'Shop Now',
                'button_url': '/shop',
                'image': '/images/landing/hero-section/6da4e59475159602882c3fabee07c1388d618dbb.png',
                'badge': {'text': 'Up to', 'value': '40%'}
            },
            # Add other sections...
        ]
        
        for idx, data in enumerate(hero_sections_data):
            section, created = PageSection.objects.get_or_create(
                page=page,
                section_type='hero',
                section_key=data['section_key'],
                defaults={
                    'title': data['title'],
                    'button_text': data['button_text'],
                    'button_url': data['button_url'],
                    'display_order': idx + 1,
                    'is_enabled': True
                }
            )
            
            if created:
                # Create image
                SectionImage.objects.create(
                    section=section,
                    image_url=data['image'],
                    image_type='main',
                    display_order=0
                )
                
                # Create badge if exists
                if 'badge' in data:
                    SectionBadge.objects.create(
                        section=section,
                        badge_type='discount',
                        text=data['badge']['text'],
                        value=data['badge']['value'],
                        position='bottom-right',
                        is_enabled=True
                    )
                
                self.stdout.write(
                    self.style.SUCCESS(f'Created hero section: {data["section_key"]}')
                )
        
        self.stdout.write(self.style.SUCCESS('Landing page seeded successfully'))
```

Run seeding:
```bash
python manage.py seed_landing_page
```

## 7. Testing

### File: `backend/apps/content/tests.py`

```python
from django.test import TestCase
from rest_framework.test import APIClient
from .models import DynamicPage, PageSection


class DynamicContentAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.page = DynamicPage.objects.create(
            page_type='landing',
            page_key='home',
            title='Home Page'
        )
    
    def test_get_landing_page(self):
        response = self.client.get('/api/hero-sections/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['success'])
    
    def test_create_section(self):
        # Add authentication
        data = {
            'section_type': 'hero',
            'section_key': 'main',
            'title': 'Test Title',
            'button_text': 'Click Me',
            'button_url': '/test'
        }
        response = self.client.post(
            f'/api/admin/dynamic-pages/home/create_section/',
            data,
            format='json'
        )
        self.assertEqual(response.status_code, 201)
```

Run tests:
```bash
python manage.py test apps.content
```

## Summary

This implementation provides:
- Complete Django models for dynamic content
- RESTful API endpoints for CRUD operations
- Public endpoints for frontend consumption
- Nested serializers for complex data structures
- Transaction support for data integrity
- Filtering and pagination
- Initial data seeding
- Test coverage

Next steps:
1. Implement file upload endpoint for images
2. Add caching layer (Redis)
3. Implement version control for sections
4. Add admin permissions and authentication
5. Create frontend admin interface
