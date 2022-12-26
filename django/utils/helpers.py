from rest_framework.response import Response

def api(message, data, status_code=200):
    api_data = {}
    api_data['error'] = False
    api_data['message'] = message
    api_data['body'] = data
    return Response(api_data, status=status_code)


def api_error(message, data={}, status_code=500):
    api_data = {}
    api_data['error'] = True
    api_data['message'] = message
    api_data['body'] = data
    return Response(api_data, status=status_code)