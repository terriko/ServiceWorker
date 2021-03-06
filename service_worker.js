// This API proposal depends on:
//  DOM: http://www.w3.org/TR/domcore/
//  URLs: http://url.spec.whatwg.org/
//  Promises: https://github.com/slightlyoff/DOMPromise/
//  Shared Workers:
//    http://www.whatwg.org/specs/web-apps/current-work/multipage/workers.html#shared-workers
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// Semi-private to work around TS. Not for impl.
var _RegistrationOptionList = (function () {
    function _RegistrationOptionList() {
        this.scope = "/*";
    }
    return _RegistrationOptionList;
})();

var ReloadPageEvent = (function (_super) {
    __extends(ReloadPageEvent, _super);
    function ReloadPageEvent() {
        _super.apply(this, arguments);
    }
    // Delay the page unload to serialise state to storage or get user's
    // permission to reload.
    ReloadPageEvent.prototype.waitUntil = function (f) {
    };
    return ReloadPageEvent;
})(_Event);

var DocumentInstallPhaseEvent = (function (_super) {
    __extends(DocumentInstallPhaseEvent, _super);
    function DocumentInstallPhaseEvent() {
        _super.apply(this, arguments);
    }
    return DocumentInstallPhaseEvent;
})(_Event);

var DocumentInstallEvent = (function (_super) {
    __extends(DocumentInstallEvent, _super);
    function DocumentInstallEvent() {
        _super.apply(this, arguments);
        this.activeWorker = null;
    }
    return DocumentInstallEvent;
})(DocumentInstallPhaseEvent);

///////////////////////////////////////////////////////////////////////////////
// The Service Worker
///////////////////////////////////////////////////////////////////////////////
var InstallPhaseEvent = (function (_super) {
    __extends(InstallPhaseEvent, _super);
    function InstallPhaseEvent() {
        _super.apply(this, arguments);
    }
    // Delay treating the installing worker until the passed Promise resolves
    // successfully. This is primarily used to ensure that an ServiceWorker is not
    // active until all of the "core" Caches it depends on are populated.
    // TODO: what does the returned promise do differently to the one passed in?
    InstallPhaseEvent.prototype.waitUntil = function (f) {
        return accepted();
    };
    return InstallPhaseEvent;
})(_Event);

var InstallEvent = (function (_super) {
    __extends(InstallEvent, _super);
    function InstallEvent() {
        _super.apply(this, arguments);
        this.activeWorker = null;
    }
    // Ensures that the worker is used in place of existing workers for
    // the currently controlled set of window instances.
    // NOTE(TOSPEC): this interacts with waitUntil in the following way:
    //   - replacement only happens upon successful installation
    //   - successful installation can be delayed by waitUntil, perhaps
    //     by subsequent event handlers.
    //   - therefore, replace doesn't happen immediately.
    InstallEvent.prototype.replace = function () {
    };
    return InstallEvent;
})(InstallPhaseEvent);

var ServiceWorkerClients = (function () {
    function ServiceWorkerClients() {
    }
    // A list of window objects, identifiable by ID, that correspond to windows
    // (or workers) that are "controlled" by this SW
    ServiceWorkerClients.prototype.getServiced = function () {
        return new Promise(function () {
        });
    };

    // Assists in restarting all windows
    //
    // Return a new Promise
    // For each attached window:
    //   Fire onreloadpage against navigator.serviceWorker
    //   If onreloadpage has default prevented:
    //     Unfreeze any frozen windows
    //     reject returned promise
    //     abort these steps
    //   If waitUntil called on onreloadpage event:
    //     frozen windows may wish to indicate which window they're blocked on
    //     yeild until promise passed into waitUntil resolves
    //     if waitUntil promise is accepted:
    //       freeze window (ui may wish to grey it out)
    //     else:
    //       Unfreeze any frozen windows
    //       reject returned promise
    //       abort these steps
    //   Else:
    //     freeze window (ui may wish to grey it out)
    // Unload all windows
    // If any window fails to unload, eg via onbeforeunload:
    //   Unfreeze any frozen windows
    //   reject returned promise
    //   abort these steps
    // Close all connections between the old worker and windows
    // Activate the new worker
    // Reload all windows asynchronously
    // Resolve promise
    ServiceWorkerClients.prototype.reloadAll = function () {
        return new Promise(function () {
        });
    };
    return ServiceWorkerClients;
})();

// The scope in which worker code is executed
var ServiceWorkerGlobalScope = (function (_super) {
    __extends(ServiceWorkerGlobalScope, _super);
    function ServiceWorkerGlobalScope() {
        _super.apply(this, arguments);
    }
    ServiceWorkerGlobalScope.prototype.fetch = function (request) {
        // Notes:
        //  ResponsePromise resolves as soon as headers are available
        //  The ResponsePromise and the Response object both contain a
        //   toBlob() method that return a Promise for the body content.
        //  The toBlob() promise will reject if the response is a OpaqueResponse
        //  or if the original ResponsePromise is rejected.
        return new ResponsePromise(function (r) {
            r.resolve(_defaultToBrowserHTTP(request));
        });
    };
    return ServiceWorkerGlobalScope;
})(WorkerGlobalScope);

///////////////////////////////////////////////////////////////////////////////
// Event Worker APIs
///////////////////////////////////////////////////////////////////////////////
// http://fetch.spec.whatwg.org/#requests
var Request = (function () {
    function Request(params) {
        // see: http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
        this.timeout = 0;
        this.method = "GET";
        // FIXME: we only provide async!
        this.synchronous = false;
        this.redirectCount = 0;
        this.forcePreflight = false;
        this.forceSameOrigin = false;
        this.omitCredentials = false;
        if (params) {
            if (typeof params.timeout != "undefined") {
                this.timeout = params.timeout;
            }
            if (typeof params.url != "undefined") {
                // should be "new URL(params.url)" but TS won't allow it
                this.url = params.url;
            }
            if (typeof params.synchronous != "undefined") {
                this.synchronous = params.synchronous;
            }
            if (typeof params.forcePreflight != "undefined") {
                this.forcePreflight = params.forcePreflight;
            }
            if (typeof params.forceSameOrigin != "undefined") {
                this.forceSameOrigin = params.forceSameOrigin;
            }
            if (typeof params.omitCredentials != "undefined") {
                this.omitCredentials = params.omitCredentials;
            }
            if (typeof params.method != "undefined") {
                this.method = params.method;
            }
            if (typeof params.headers != "undefined") {
                this.headers = params.headers;
            }
            if (typeof params.body != "undefined") {
                this.body = params.body;
            }
        }
    }
    return Request;
})();

// http://fetch.spec.whatwg.org/#responses
var AbstractResponse = (function () {
    function AbstractResponse() {
    }
    return AbstractResponse;
})();

var OpaqueResponse = (function (_super) {
    __extends(OpaqueResponse, _super);
    function OpaqueResponse() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(OpaqueResponse.prototype, "url", {
        get: // This class represents the result of cross-origin fetched resources that are
        // tainted, e.g. <img src="http://cross-origin.example/test.png">
        function () {
            return "";
        },
        enumerable: true,
        configurable: true
    });
    return OpaqueResponse;
})(AbstractResponse);

var Response = (function (_super) {
    __extends(Response, _super);
    function Response(params) {
        if (params) {
            if (typeof params.status != "undefined") {
                this.status = params.status;
            }
            if (typeof params.statusText != "undefined") {
                this.statusText = params.statusText;
            }
            if (typeof params.method != "undefined") {
                this.method = params.method;
            }
            if (typeof params.headers != "undefined") {
                this.headers = params.headers;
            }
            /*
            // FIXME: What do we want to do about passing in the body?
            if (typeof params.body != "undefined") {
            this.body = params.body;
            }
            */
        }
        _super.call(this);
    }
    Object.defineProperty(Response.prototype, "headers", {
        get: function () {
            // TODO: outline the whitelist of readable headers
            return this._headers;
        },
        set: function (items) {
            var _this = this;
            if (items instanceof Map) {
                items.forEach(function (value, key, map) {
                    return _this._headers.set(key, value);
                });
            } else {
                for (var x in items) {
                    (function (x) {
                        if (items.hasOwnProperty(x)) {
                            this._headers.set(x, items[x]);
                        }
                    }).call(this, x);
                }
            }
        },
        enumerable: true,
        configurable: true
    });

    Response.prototype.toBlob = function () {
        return accepted(new Blob());
    };
    return Response;
})(AbstractResponse);

var CORSResponse = (function (_super) {
    __extends(CORSResponse, _super);
    function CORSResponse() {
        _super.apply(this, arguments);
    }
    return CORSResponse;
})(Response);

var ResponsePromise = (function (_super) {
    __extends(ResponsePromise, _super);
    function ResponsePromise() {
        _super.apply(this, arguments);
    }
    ResponsePromise.prototype.toBlob = function () {
        return accepted(new Blob());
    };
    return ResponsePromise;
})(Promise);
var RequestPromise = (function (_super) {
    __extends(RequestPromise, _super);
    function RequestPromise() {
        _super.apply(this, arguments);
    }
    return RequestPromise;
})(Promise);

var FetchEvent = (function (_super) {
    __extends(FetchEvent, _super);
    function FetchEvent() {
        _super.call(this, "fetch", { cancelable: true, bubbles: false });
        // Can be one of:
        //   "connect",
        //   "font",
        //   "img",
        //   "object",
        //   "script",
        //   "style",
        //   "worker",
        //   "popup",
        //   "child",
        //   "navigate"
        this.purpose = "connect";
        // Has the user provided intent for the page to be reloaded fresher than
        // their current view? Eg: pressing the refresh button
        // Clicking a link & hitting back shouldn't be considered a reload.
        // Ctrl+l enter: Left to the UA to decide
        this.isReload = false;

        // This is the meat of the API for most use-cases.
        // If preventDefault() is not called on the event, the request is sent to
        // the default browser worker. That is to say, to respond with something
        // from the cache, you must preventDefault() and respond with it manually,
        // digging the resource out of the cache and calling
        // evt.respondWith(cachedItem).
        //
        // Note:
        //    while preventDefault() must be called synchronously to cancel the
        //    default, responding does not need to be synchronous. That is to say,
        //    you can do something async (like fetch contents, go to IDB, whatever)
        //    within whatever the network time out is and as long as you still have
        //    the FetchEvent instance, you can fulfill the request later.
        this.client = null;
    }
    // * If a Promise is provided, it must resolve with a Response, else a
    //   Network Error is thrown.
    // * If the request isTopLevel navigation and the return value
    //   is a CrossOriginResponse (an opaque response body), a Network Error is
    //   thrown.
    // * The final URL of all successful (non network-error) responses is
    //   the *requested* URL.
    // * Renderer-side security checks about tainting for
    //   x-origin content are tied to the transparency (or opacity) of
    //   the Response body, not URLs.
    //
    //  respondWith(r: Promise) : void;
    //  respondWith(r: Response) : void;
    FetchEvent.prototype.respondWith = function (r) {
        if (!(r instanceof Response) || !(r instanceof Promise)) {
            throw new Error("Faux NetworkError because DOM is currently b0rken");
        }

        this.stopImmediatePropagation();

        if (r instanceof Response) {
            r = new Promise(function (resolver) {
                resolver.resolve(r);
            });
        }
        r.then(_useWorkerResponse, _defaultToBrowserHTTP);
    };

    // "any" to make the TS compiler happy:
    FetchEvent.prototype.forwardTo = function (url) {
        if (!(url instanceof _URL) || typeof url != "string") {
            throw new Error("Faux NetworkError because DOM is currently b0rken");
        }

        this.stopImmediatePropagation();

        return new Promise(function (resolver) {
            resolver.resolve(new Response({
                status: 302,
                headers: { "Location": url.toString() }
            }));
        });
    };
    return FetchEvent;
})(_Event);

// Design notes:
//  - Caches are atomic: they are not complete until all of their resources are
//    fetched
//  - Updates are also atomic: the old contents are visible until all new
//    contents are fetched/installed.
//  - Caches should have version numbers and "update" should set/replace it
// This largely describes the current Application Cache API. It's only available
// inside worker instances (not in regular documents), meaning that caching is a
// feature of the event worker. This is likely to change!
var Cache = (function () {
    function Cache() {
        var items = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            items[_i] = arguments[_i + 0];
        }
        this._readyPromise = this.add.apply(this, items);
    }
    Cache.prototype.match = function (request) {
        // the UA will do something more optimal than this:
        return this.matchAll(request).then(function (responses) {
            if (responses[0]) {
                return responses[0];
            }
            throw Error("No match");
        });
        // TODO: is it weird that this rejects on no result whereas matchAll/Keys resolve with empty array?
        // This needs to reject to work well with respondWith
    };

    // TODO: maybe this would be better as a querying method
    // so matchAll(string) would match all entries for that
    // url regardless of vary
    Cache.prototype.matchAll = function (request) {
        var thisCache = this;

        return this.keys(request).then(function (keys) {
            return Promise.all(keys.map(function (key) {
                return thisCache._items.get(key);
            }));
        });
    };

    Cache._cacheItemValid = function (request, cachedRequest, cachedResponse) {
        if (cachedRequest.method != request.method)
            return false;
        if (cachedRequest.url != request.url)
            return false;

        if (!cachedResponse.headers.has('vary'))
            return true;

        var varyHeaders = cachedResponse.headers.get('vary').split(',');
        var varyHeader;

        for (var i = 0; i < varyHeaders.length; i++) {
            varyHeader = varyHeaders[i].trim();

            if (varyHeader == '*') {
                continue;
            }

            if (cachedRequest.headers.get(varyHeader) != request.headers.get(varyHeader)) {
                return false;
            }
        }

        return true;
    };

    Cache.prototype.keys = function (filterRequest) {
        var thisCache = this;

        if (!filterRequest)
            return this._items.keys();

        filterRequest = _castToRequest(filterRequest);

        return this._items.keys().then(function (cachedRequests) {
            // get the response
            return this._items.values().then(function (cachedResponses) {
                return cachedRequests.filter(function (cachedRequest, i) {
                    return Cache._cacheItemValid(filterRequest, cachedRequest, cachedResponses[i]);
                });
            });
        });
    };

    Cache.prototype.add = function () {
        var items = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            items[_i] = arguments[_i + 0];
        }
        var thisCache = this;
        var newItems = items.map(function (item) {
            if (item instanceof Response) {
                return {
                    'request': new Request({
                        'url': item.url,
                        'method': item.method
                    }),
                    'response': item
                };
            }

            item = _castToRequest(item);

            return {
                'request': item,
                'response': fetch(item)
            };
        });

        // wait for all our requests to complete
        return Promise.all(newItems.map(function (item) {
            return item.response;
        })).then(function (responses) {
            // TODO: figure out what we consider success/failure
            responses.forEach(function (response) {
                if (response.status != 200) {
                    throw Error('Request failed');
                }
            });

            return Promise.all(responses.map(function (response, i) {
                return thisCache.set(newItems[i].request, response);
            }));
        });
    };

    // TODO: accept ResponsePromise too?
    Cache.prototype.set = function (request, response) {
        var thisCache = this;
        request = _castToRequest(request);

        // TODO: if request.method is not GET, throw
        // TODO: cast 'response' to a response
        // Eg, Blob
        // Dataurl string
        // Could cast regular string as text/plain response, but is that useful?
        // TODO: this delete/set implementation isn't atomic, but needs to be.
        // Not sure how to implement it, maybe via a private _locked promise?
        // Deleting is garbage collection, but also ensures "uniqueness"
        return this.delete(request).then(function () {
            return thisCache._items.set(request, response);
        }).then(function () {
            return response;
        });
    };

    // delete zero or more entries
    Cache.prototype.delete = function (request) {
        // TODO: this means cache.delete("/hello/world/") may not delete
        // all entries for /hello/world/, because /hello/world/ will be
        // cast to a GET request. It won't remove entries for that url
        // that have 'vary' headers that don't match.
        //
        // We could special-case strings & urls here.
        var thisCache = this;

        return this.keys(request).then(function (cachedRequests) {
            return Promise.all(cachedRequests.map(function (cachedRequest) {
                return thisCache._items.delete(cachedRequest);
            }));
        });
    };

    // TODO: ready is only useful to validate the items added during construction
    // maybe we should get rid of the constructor param and force people to use
    // add() which returns a promise for that atomic operation
    Cache.prototype.ready = function () {
        return this._readyPromise;
    };
    return Cache;
})();

var CacheList = (function () {
    function CacheList(iterable) {
    }
    // "any" to make the TS compiler happy
    CacheList.prototype.match = function (url, cacheName) {
        return new ResponsePromise(function () {
        });
    };

    CacheList.prototype.get = function (key) {
        return accepted();
    };
    CacheList.prototype.has = function (key) {
        return accepted();
    };
    CacheList.prototype.set = function (key, val) {
        return accepted(this);
    };
    CacheList.prototype.clear = function () {
        return accepted();
    };
    CacheList.prototype.delete = function (key) {
        return accepted();
    };
    CacheList.prototype.forEach = function (callback, thisArg) {
    };
    CacheList.prototype.items = function () {
        return accepted([]);
    };
    CacheList.prototype.keys = function () {
        return accepted([]);
    };
    CacheList.prototype.values = function () {
        return accepted([]);
    };
    Object.defineProperty(CacheList.prototype, "size", {
        get: function () {
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return CacheList;
})();

////////////////////////////////////////////////////////////////////////////////
// Utility Decls to make the TypeScript compiler happy
////////////////////////////////////////////////////////////////////////////////
// See:
//    http://www.whatwg.org/specs/web-apps/current-work/multipage/web-messaging.html#broadcasting-to-other-browsing-contexts
var BroadcastChannel = (function () {
    function BroadcastChannel(channelName) {
    }
    return BroadcastChannel;
})();
;

var WorkerGlobalScope = (function (_super) {
    __extends(WorkerGlobalScope, _super);
    function WorkerGlobalScope() {
        _super.apply(this, arguments);
    }
    WorkerGlobalScope.prototype.setTimeout = function (handler, timeout) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            args[_i] = arguments[_i + 2];
        }
        return 0;
    };

    WorkerGlobalScope.prototype.setInterval = function (handler, timeout) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            args[_i] = arguments[_i + 2];
        }
        return 0;
    };

    // WindowTimerExtensions
    WorkerGlobalScope.prototype.msSetImmediate = function (expression) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        return 0;
    };

    WorkerGlobalScope.prototype.setImmediate = function (expression) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            args[_i] = arguments[_i + 1];
        }
        return 0;
    };

    // WindowBase64
    WorkerGlobalScope.prototype.btoa = function (rawString) {
        return "";
    };
    WorkerGlobalScope.prototype.atob = function (encodedString) {
        return "";
    };
    return WorkerGlobalScope;
})(_EventTarget);

// Cause, you know, the stock definition claims that URL isn't a class. FML.
var _URL = (function () {
    function _URL(url) {
    }
    return _URL;
})();

// the TS compiler is unhappy *both* with re-defining DOM types and with direct
// sublassing of most of them. This is sane (from a regular TS pespective), if
// frustrating. As a result, we describe the built-in Event type with a prefixed
// name so that we can subclass it later.
var _Event = (function () {
    function _Event(type, eventInitDict) {
        this.bubbles = false;
        this.cancelable = true;
        this.defaultPrevented = false;
        this.isTrusted = false;
    }
    _Event.prototype.stopPropagation = function () {
    };
    _Event.prototype.stopImmediatePropagation = function () {
    };
    _Event.prototype.preventDefault = function () {
    };
    return _Event;
})();

var _CustomEvent = (function (_super) {
    __extends(_CustomEvent, _super);
    // Constructor(DOMString type, optional EventInit eventInitDict
    function _CustomEvent(type, eventInitDict) {
        _super.call(this, type, eventInitDict);
    }
    return _CustomEvent;
})(_Event);

var _EventTarget = (function () {
    function _EventTarget() {
    }
    _EventTarget.prototype.dispatchEvent = function (e) {
        return true;
    };
    return _EventTarget;
})();

// https://github.com/slightlyoff/DOMPromise/blob/master/DOMPromise.idl
var Resolver = (function () {
    function Resolver() {
    }
    Resolver.prototype.accept = function (v) {
    };
    Resolver.prototype.reject = function (v) {
    };
    Resolver.prototype.resolve = function (v) {
    };
    return Resolver;
})();

var Promise = (function () {
    // Callback type decl:
    //  callback : (n : number) => number
    function Promise(init) {
    }
    Promise.prototype.then = function (fulfilled) {
        return accepted();
    };

    Promise.prototype.catch = function (rejected) {
        return accepted();
    };

    Promise.all = function () {
        var stuff = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            stuff[_i] = arguments[_i + 0];
        }
        return accepted();
    };
    return Promise;
})();

function accepted(v) {
    if (typeof v === "undefined") { v = true; }
    return new Promise(function (r) {
        r.accept(true);
    });
}

function acceptedResponse() {
    return new ResponsePromise(function (r) {
        r.accept(new Response());
    });
}

function fetch(url) {
    return acceptedResponse();
}

// http://www.whatwg.org/specs/web-apps/current-work/multipage/workers.html#shared-workers-and-the-sharedworker-interface
var SharedWorker = (function (_super) {
    __extends(SharedWorker, _super);
    function SharedWorker(url, name) {
        _super.call(this);
    }
    return SharedWorker;
})(_EventTarget);

////////////////////////////////////////////////////////////////////////////////
// Not part of any public standard but used above:
////////////////////////////////////////////////////////////////////////////////
var Client = (function () {
    function Client() {
    }
    return Client;
})();

var _useWorkerResponse = function () {
    return accepted();
};
var _defaultToBrowserHTTP = function (url) {
    return accepted();
};

// take a string or url and resolve it to a request
function _castToRequest(item) {
    if (item instanceof String) {
        item = new _URL(item);
    }

    if (item instanceof _URL) {
        item = new Request({
            'url': item
        });
    }

    if (!(item instanceof Request)) {
        throw TypeError("Param must be string/URL/Request");
    }

    return item;
}
