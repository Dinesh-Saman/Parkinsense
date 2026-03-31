from locust import HttpUser, task, between

class ParkinSenseUser(HttpUser):
    # Simulate users waiting between 1 to 3 seconds between tasks
    wait_time = between(1, 3)

    @task(1)
    def index(self):
        # Health check endpoint
        self.client.get("/")

    @task(2)
    def auth_status(self):
        # Check an API endpoint (simulating user checking their status)
        with self.client.get("/api/auth/status", catch_response=True) as response:
            if response.status_code == 404:
                # 404 is expected if not logged in but it still shows the server is responsive
                response.success()
