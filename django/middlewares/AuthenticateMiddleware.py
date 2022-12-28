class AuthenticateMiddelware:
    def __init__(self, get_response):
        self.get_response = get_response
        print('inside init')
    def __call__(self, request):
        print('inside call')