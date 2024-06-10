/**
 *
 * Mutltithreaded message queuing by Lourah
 *
 */
var $Q = $Q || {};

(function () {
    $Q.MessageQueue = function () {
      queue = [];
      this.add = new Packages.org.mozilla.javascript.Synchronizer(
        (message) => queue.push(message)
        );
      this.oob = new Packages.org.mozilla.javascript.Synchronizer(
        (message) => queue.unshift(message)
        );
      this.get = new Packages.org.mozilla.javascript.Synchronizer(
        () => queue.shift()
        );
      this.isEmpty = new Packages.org.mozilla.javascript.Synchronizer(
        () => queue.length === 0
        );
      this.peek = new Packages.org.mozilla.javascript.Synchronizer(
        (at) => (queue.length === 0 || at < 0|| at > queue.length)?undefined:queue[at?at:0]
        );
      this.size = new Packages.org.mozilla.javascript.Synchronizer(
        () => queue.length
        );
      }

    $Q.ServiceRegistrator = (function () {
        $Q.Service = function(f) {
          this.getName = () => f.name;
          this.qMessageQueue = new $Q.MessageQueue();
          this.toString = () => "$Q.Service(" + f.name + ")";
          };

        $Q.Service.prototype.wait = new Packages.org.mozilla.javascript.Synchronizer(function(ms) {
            try {
              var objClazz = java.lang.Class.forName('java.lang.Object');
              var waitMethod = objClazz.getMethod('wait', null);
              var timems = ms?ms:null;
              waitMethod.invoke(this, timems);
              } catch(e) {
              Activity.reportError(
                "$Q.Service::wait::"
                + e
                + "::"
                + e.stack
                );
              }
            });

        $Q.Service.prototype.notify = new Packages.org.mozilla.javascript.Synchronizer(function() {
            try {
              var objClazz = java.lang.Class.forName('java.lang.Object');
              var notifyMethod = objClazz.getMethod('notify', null);
              notifyMethod.invoke(this, null);
              } catch(e) {
              Activity.reportError(
                "$Q.Service::notify::"
                + e
                + "::"
                + e.stack
                );
              }
            });

        $Q.Service.prototype.notifyAll = new Packages.org.mozilla.javascript.Synchronizer(function() {
            try {
              var objClazz = java.lang.Class.forName('java.lang.Object');
              var notifyAllMethod = objClazz.getMethod('notifyAll', null);
              notifyAllMethod.invoke(this, null);
              } catch(e) {
              Activity.reportError(
                "$Q.Service::notifyAll::"
                + e
                + "::"
                + e.stack
                );

              }
            });

        instances = {};
        return new function () {
          this.getInstance = function(f) {
            if (!instances[f.name]) {
              instances[f.name] = new $Q.Service(f);
              }
            return instances[f.name];
            };
          };
        }) ();

    $Q.Thread = function (runner) {
      var array;
      var index;
      var value;
      var service = $Q.ServiceRegistrator.getInstance(runner);
      var load = -1;
      var thread = Lourah.jsFramework.createThread(() => {
          try {
            if (array.qThreadListener
              && array.qThreadListener.onStart) {
              array.qThreadListener.onStart(this, index);
              }
            runner(this);
            if (array.qThreadListener
              && array.qThreadListener.onStop) {
              array.qThreadListener.onStop(this, index);
              }
            load = -1;
            } catch(e) {
            Activity.reportError(
              "$Q.Thread::"
              + e
              + "::"
              + e.stack
              );
            }
          });
      this.getThread = () => thread;
      this.getRunner = () => runner;
      this.getContext = () => context;
      this.getService = () => service;
      this.getLoad = () => load;
      this.setValue = (v) => {
        try {
          if (array.qThreadListener
            && array.qThreadListener.onBeforeChangeValue) {
            array.qThreadListener.onBeforeChangeValue(
              this
              , index
              , value
              , v
              );
            }
          value = v;
          if (array.qThreadListener
            && array.qThreadListener.onChangeValue) {
            array.qThreadListener.onChangeValue(
              this
              , index
              , value
              );
            }
          } catch(e) {
          Activity.reportError(
            "$Q.Thread::setValue::"
            + e
            + "::"
            + e.stack
            );
          }
        };

      this.getValue = () => value;
      this.start = (i, a) => {
        try {
          array = a;
          index = i;
          array.qThread[index] = this;
          thread.start();
          load = 0;
          } catch(e) {
          Activity.reportError(
            "$Q.Thread::start::"
            + e
            + "::"
            + e.stack
            );
          }
        }
      this.getIndex = () => index;
      this.getArray = () => array;

      this.postMessage = new Packages.org.mozilla.javascript.Synchronizer((service, msg, oob) => {
          try {
            var notifier = $Q.ServiceRegistrator.getInstance(service);
            if (oob) notifier.qMessageQueue.oob(msg);
            else notifier.qMessageQueue.add(msg);
            notifier.notifyAll();
            } catch(e) {
            Activity.reportError("$Q.Thread::postMessage::" + e + "::" + e.stack);
            }
          });

      this.waitMessage = new Packages.org.mozilla.javascript.Synchronizer((fProcessMessage) => {
          var msg;
          do {
            while(this.getService().qMessageQueue.isEmpty()) {
              this.getService().wait();
              }
            this.getService().notifyAll();
            msg = this.getService().qMessageQueue.get();
            } while(!msg);

          return msg;
          });

      this.peer = (a, i) => {
        try {
          return a.qThread[i];
          } catch(e) {
          Activity.reportError("$Q.Thread::peer::" + e + "::" + e.stack);
          }
        };

      this.toString = () => {
        return "$Q.Thread::"
        + runner.name
        + "::"
        + array.length
        + "::"
        + index
        ;
        }
      }

    $Q.arrayFactory = function(a) {
      a.qThread = new Array(a.length);
      a.qThreadListener = {};
      a.setQThreadListener = (qtListener) => {
        a.qThreadListener = qtListener;
        }
      a.start = (i) => (a[i].qThread = new $Q.Thread(a[i])).start(i, a);
      a.startAll = () => {
        for(var i = 0; i < a.length; i++) {
          a.start(i);
          }
        }
      return a;
      }

    })();

