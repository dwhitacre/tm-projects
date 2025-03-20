package api

import (
	"net/http"
	"os"
	"slices"
)

func AdminMiddleware(handler func (w http.ResponseWriter, r *http.Request)) func (w http.ResponseWriter, r *http.Request) {
	return AdminExceptionMiddleware(handler, []string{})
}

func AdminExceptionMiddleware(handler func (w http.ResponseWriter, r *http.Request), allowedMethods []string) func (w http.ResponseWriter, r *http.Request) {
	return func (w http.ResponseWriter, r *http.Request) {
		key := os.Getenv("ADMIN_KEY")
		if key == "" {
			logger.Warn("Admin key is not configured, denying request for safety.")
			w.WriteHeader(http.StatusForbidden)
			return
		}

		if len(allowedMethods) > 0 && slices.Contains(allowedMethods, r.Method) {
			handler(w, r)
			return
		}

		if key != r.Header.Get("x-hdstmevents-adminkey") {
			logger.Info("Header did not match configured admin key.")
			w.WriteHeader(http.StatusForbidden)
			return
		}

		handler(w, r)
	}
}