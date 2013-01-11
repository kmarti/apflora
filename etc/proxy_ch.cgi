import logging
import httplib2
import Cookie

from pylons import request, response, session
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController

log = logging.getLogger(__name__)

class ApiprintproxyController(BaseController):

    def index(self):

        url_scheme = request.environ["wsgi.url_scheme"]
        if url_scheme not in ("http", "https"):
            abort(403) # Forbidden

        if "url" in request.params:
            url = request.params["url"]

        if "path" not in request.params:
             abort(400, "Missing an 'url' parameter") # Bad Request

        printpath = request.params["path"]

        # get method
        method = request.method

        # get body
        body = None
        if method in ("POST", "PUT"):
            body = request.body

        # forward request to target (without Host Header)
        http = httplib2.Http()
        h = dict(request.headers)
        h.pop("Host", h)

        try:
            if "url" in request.params:
                resp, content = http.request(url_scheme + "://api.geo.admin.ch/main/wsgi/print/" + str(printpath) + "?url=" + url, method=method, body=body, headers=h)
            else:
                resp, content = http.request(url_scheme + "://api.geo.admin.ch/main/wsgi/print/" + str(printpath), method=method, body=body, headers=h)
        except:
            abort(502) # Bad Gateway

        if resp.has_key("content-type"):
            response.headers["Content-Type"] = resp["content-type"]
        if resp.has_key("set-cookie"):
            c = Cookie.SimpleCookie()
            c.load(resp["set-cookie"])
            morsel = c.get('SRV')
            if morsel is not None:
                morsel['path'] = request.path
                response.headers["Set-Cookie"] = "SRV=%s; path=%s" % ( morsel.value, morsel['path'])

        if resp.has_key("Content-Disposition"):
            response.headers["Content-Disposition"] = resp["Content-Disposition"]
        if resp.has_key("content-disposition"):
            response.headers["Content-Disposition"] = resp["content-disposition"]

        response.status = resp.status

        return content