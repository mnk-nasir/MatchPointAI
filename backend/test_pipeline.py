import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from core.models import StartupEvaluation
from core.models.deals import PipelineStage
from core.serializers.deals_serializers import PipelineStageSerializer
from core.models.user import User

def test_serializer():
    # Check startups
    startups = StartupEvaluation.objects.all()
    print(f"Total StartupEvaluation items: {startups.count()}")
    
    # Check users
    users = User.objects.all()
    print(f"Total User items: {users.count()}")

    if startups.exists() and users.exists():
        startup = startups.first()
        user = users.first()
        print(f"Testing on startup: {startup.company_name}")
        
        # Create a mock or temporary PipelineStage (not committed or deleted after)
        # Using build or getting existing
        try:
            # Let's try to get or create just for this test
            stage, created = PipelineStage.objects.get_or_create(
                user=user,
                startup=startup,
                defaults={'stage': 'New Startups'}
            )
            print(f"PipelineStage item {'created' if created else 'found'}.")
            
            # Serialize
            serializer = PipelineStageSerializer(stage)
            print("Serialized Data:")
            for k, v in serializer.data.items():
                print(f"  {k}: {v}")
                
            # Clean up if created
            if created:
                stage.delete()
                print("Temporary PipelineStage item deleted.")
                
            print("\nSuccess!")
        except Exception as e:
            print(f"Error during test: {e}")
    else:
        print("Required data (StartupEvaluation & User) not found to create test PipelineStage.")

if __name__ == '__main__':
    test_serializer()
