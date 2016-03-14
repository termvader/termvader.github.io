(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('backbone/utils',['libraries', 'backbone'], function() {
    var Housing, _polyfill_event;
    Housing = {};
    Housing.Util = {};
    Housing.Util.loadlocalStorage = function() {
      var keys;
      if (Housing.Util.is_localstorage_accessible()) {
        Housing.localStorage = {};
        keys = _.keys(window.localStorage);
        return _.each(keys, function(key) {
          return Housing.localStorage[key] = window.localStorage[key];
        });
      }
    };
    Housing.Util.read_localStorage = function(type) {
      if (Housing.Util.is_localstorage_accessible()) {
        if (!Housing.localStorage) {
          Housing.Util.loadlocalStorage();
        }
        if (Housing.localStorage[type] === 'undefined') {
          return false;
        }
        return Housing.localStorage[type];
      }
    };
    Housing.Util.write_localStorage = function(type, value) {
      if (Housing.Util.is_localstorage_accessible()) {
        if (!Housing.localStorage) {
          Housing.Util.loadlocalStorage();
        }
        window.localStorage.setItem(type, value);
        return Housing.localStorage[type] = value;
      }
    };
    Housing.Util.delete_localStorage = function(type) {
      if (Housing.Util.is_localstorage_accessible() && type) {
        delete window.localStorage[type];
        return delete Housing.localStorage[type];
      }
    };
    Housing.Util.format_money = (function(_this) {
      return function(val, k_prec, l_prec, c_prec) {
        var cr, k, lac, multiplier, new_val, short_unit, unit;
        if (k_prec == null) {
          k_prec = 0;
        }
        if (l_prec == null) {
          l_prec = 0;
        }
        if (c_prec == null) {
          c_prec = 0;
        }
        cr = 10000000;
        lac = 100000;
        k = 1000;
        multiplier = 1;
        val = parseInt(val);
        if (val >= cr) {
          unit = 'Crs';
          short_unit = 'Cr';
          multiplier = cr;
          if (val - cr < cr) {
            new_val = parseFloat(val / cr).toFixed(2);
          } else {
            new_val = parseFloat(val / cr).toFixed(c_prec);
          }
          if (parseInt(new_val) === 1) {
            unit = 'Cr';
          }
        } else if (val >= lac) {
          unit = 'Lacs';
          short_unit = 'L';
          multiplier = lac;
          if (val - lac < lac) {
            new_val = parseFloat(val / lac).toFixed(2);
          } else {
            new_val = parseFloat(val / lac).toFixed(l_prec);
          }
          if (parseInt(new_val) === 1) {
            unit = 'Lac';
          }
        } else if (val >= k) {
          unit = 'K';
          short_unit = 'K';
          multiplier = k;
          new_val = parseFloat(val / k).toFixed(k_prec);
        } else {
          unit = '';
          new_val = val;
        }
        return {
          unit: unit,
          value: new_val,
          original: val,
          multiplier: multiplier,
          short_unit: short_unit || ''
        };
      };
    })(this);
    Housing.Util.comma_formatted = function(amount) {
      var a, an, delimiter, i, len, n, nn, ref;
      delimiter = ",";
      if (typeof amount !== 'string') {
        amount = amount.toString();
      }
      if ((0 < (ref = parseFloat(amount)) && ref < 1)) {
        return parseFloat(amount).toFixed(3);
      }
      a = amount.split('.', 2);
      i = parseInt(a[0]);
      if (isNaN(i)) {
        i = 0;
      }
      i = Math.abs(i);
      n = '' + i;
      a = [];
      len = n.length;
      if (len > 3) {
        nn = n.substr(n.length - 3);
        a.unshift(nn);
        n = n.substr(0, n.length - 3);
        while (n.length > 2) {
          an = n.substr(n.length - 2);
          a.unshift(an);
          n = n.substr(0, n.length - 2);
        }
        if (n.length > 0) {
          a.unshift(n);
        }
        n = a.join(delimiter);
      }
      return n;
    };
    Housing.Util.EllipsisOnHover = function($el, pos) {
      var els;
      if (pos == null) {
        pos = 'top';
      }
      if ($el) {
        els = $el.find('.mightOverflow');
        return els.each(function(el) {
          var $this;
          if (this.offsetWidth < this.scrollWidth) {
            $this = $(this).attr('data-title', $(this).text()).addClass('tooltipped');
            if (pos === 'top') {
              return $this.addClass('tooltipped-top');
            }
          }
        });
      }
    };
    Date.prototype.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    Date.prototype.getMonthName = function() {
      return this.monthNames[this.getMonth()];
    };
    Date.prototype.shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    Date.prototype.getShortMonthName = function() {
      return this.shortMonthNames[this.getMonth()];
    };
    Date.prototype.toNormalDateString = function() {
      return this.getDate() + " " + this.getShortMonthName() + ", " + this.getFullYear();
    };
    Date.prototype.toFullNormalDateString = function() {
      return this.getMonthName() + " " + this.getDate() + ", " + this.getFullYear();
    };
    Housing.Util.is_localstorage_accessible = function() {
      var e, error;
      if (Housing.is_localstorage_accessible !== void 0) {
        return Housing.is_localstorage_accessible;
      }
      try {
        if (!localStorage) {
          Housing.is_localstorage_accessible = false;
        } else {
          localStorage['housing-key'] = 'housing.com';
          if (localStorage['housing-key'] === 'housing.com') {
            Housing.is_localstorage_accessible = true;
          } else {
            Housing.is_localstorage_accessible = false;
          }
        }
      } catch (error) {
        e = error;
        Housing.is_localstorage_accessible = false;
      }
      return Housing.is_localstorage_accessible;
    };
    Housing.Util.ApplyInvalidInputHelper = function(input, validator) {
      var type;
      if (typeof input === 'string') {
        input = $(validator);
        validator = null;
        type = input;
        if (type === 'phone') {
          type = 'tel';
        }
      }
      if (!(input instanceof jQuery && typeof input.prop('setCustomValidity') === 'function')) {
        return;
      }
      type = input.attr('type');
      if (typeof validator !== 'function') {
        if (type === 'tel') {
          validator = function() {
            var message;
            message = 'Please enter a valid 10 digit phone number.';
            if (this.value) {
              message = this.value + ' is not a valid phone number.\n' + message;
            }
            return message;
          };
        } else if (type === 'name') {
          validator = function() {
            if (this.value) {
              return this.value + ' is not a valid name.';
            } else {
              return 'Please enter your name.';
            }
          };
        } else if (type === 'email') {
          validator = function() {
            if (this.value) {
              return this.value + ' is not a valid email address.';
            } else {
              return 'Please enter your email address.';
            }
          };
        }
      }
      if (typeof validator === 'function') {
        return input.on('input', function() {
          if (this.validity.patternMismatch) {
            return this.setCustomValidity(validator.apply(this));
          } else {
            return this.setCustomValidity('');
          }
        });
      }
    };
    Housing.Util.daysDiff = function(date1, date2) {
      var oneDay;
      if (!date2) {
        date2 = new Date();
      }
      oneDay = 24 * 60 * 60 * 1000;
      return parseInt(date2.getTime() / oneDay) - parseInt(date1.getTime() / oneDay);
    };
    _polyfill_event = function(event, callback) {
      if (!(indexOf.call(window, 'onorientationchange') >= 0) && event === 'orientationchange') {
        return {
          event: 'resize',
          callback: function(e) {
            var orientation;
            if (window.matchMedia && window.matchMedia('(orientation: portrait)').matches || screen.width < screen.height) {
              orientation = 'portrait';
            } else if (window.matchMedia && window.matchMedia('(orientation: landscape)').matches || screen.width > screen.height) {
              orientation = 'landscape';
            }
            e.data = {
              orientation: orientation
            };
            return callback(e);
          }
        };
      }
    };
    Housing.Util._listeners = {};
    Housing.Util.listenTo_bb = Backbone.Events.listenTo;
    Housing.Util.listenToOnce_bb = Backbone.Events.listenToOnce;
    Housing.Util.stopListening_bb = Backbone.Events.stopListening;
    Housing.Util.listenTo = function(target, event, handler) {
      var _listeners, args, callback, delegateTarget, e_split, ekey, event_split, i, ns, polyfill_event;
      if (target instanceof jQuery) {
        if (typeof event !== 'string') {
          hlog('invalid event', arguments);
          return;
        }
        event_split = event.split(' ');
        if (event_split.length > 1) {
          i = 0;
          while (i < event_split.length) {
            Housing.Util.listenTo.apply(this, [target, event_split[i++]].concat([].slice.call(arguments, 2)));
          }
          return;
        }
        if (!target.length) {
          hlog('empty selector', target.selector);
          return;
        }
        callback = arguments[arguments.length - 1];
        if (typeof callback !== 'function') {
          hlog('invalid handler', arguments);
        }
        if (!Housing.Util._listeners[this.cid]) {
          Housing.Util._listeners[this.cid] = {};
        }
        _listeners = Housing.Util._listeners[this.cid];
        e_split = event.split('.');
        ekey = e_split[0];
        polyfill_event = _polyfill_event(ekey, callback);
        if (polyfill_event) {
          ekey = polyfill_event.event;
          callback = polyfill_event.callback;
        }
        ns = e_split.length > 1 ? e_split.slice(0).sort().join('.') : null;
        delegateTarget = typeof handler === 'string' ? handler : null;
        target.each(function(i, v) {
          var id, o;
          id = $(v).data('_bb');
          if (!id) {
            id = _.uniqueId();
            $(v).data('_bb', id);
          }
          if (!_listeners[id]) {
            _listeners[id] = {
              _el: v
            };
          }
          o = _listeners[id];
          if (!o[ekey]) {
            o[ekey] = [];
          }
          return o[ekey].push({
            handler: callback,
            ns: ns,
            delegate: delegateTarget,
            selector: target.selector
          });
        });
        args = [event + '.bb_' + this.cid, handler];
        if (typeof handler === 'string') {
          args.push(callback);
        }
        target.on.apply(target, args);
        if (target.length > 10) {
          hlog('listener attached:', target.selector || target[0].toString(), args);
          hlog('^attached on >10 elements, consider event delegation');
        }
        return;
      }
      return Housing.Util.listenTo_bb.apply(this, arguments);
    };
    Housing.Util.stopListening = function(target, event, handler) {
      var args, callback, e, e_o, event_obj, event_split, i, id, j, len1, o, ref, view_listenres;
      if (arguments && !arguments.length) {
        ref = Housing.Util._listeners[this.cid];
        for (id in ref) {
          e = ref[id];
          $(e._el).off('.bb_' + this.cid);
          if (!e._el) {
            herr('no _el: ', e);
          }
        }
        delete Housing.Util._listeners[this.cid];
      } else if (target instanceof jQuery) {
        if (typeof event === 'string') {
          event_split = event.split(' ');
          if (event_split.length > 1) {
            i = 0;
            while (i < event_split.length) {
              Housing.Util.stopListening.apply(this, [target, event_split[i++]].concat([].slice.call(arguments, 2)));
            }
            return;
          }
          args = [event + '.bb_' + this.cid];
        } else {
          args = ['.bb_' + this.cid];
        }
        if (typeof handler === 'string') {
          args.push(handler);
        }
        callback = arguments[arguments.length - 1];
        if (typeof callback === 'function') {
          args.push(callback);
        }
        target.off.apply(target, args);
        for (j = 0, len1 = target.length; j < len1; j++) {
          e = target[j];
          id = $(e).data('_bb');
          view_listenres = Housing.Util._listeners[this.cid];
          if (view_listenres) {
            o = view_listenres[id];
          }
          if (!o) {
            return;
          }
          if (typeof event === 'string') {
            event_split = event.split('.');
            event_obj = o[event_split[0]];
            if (!(event_obj instanceof Array)) {
              return;
            }
            i = event_obj.length - 1;
            while (i >= 0) {
              e_o = event_obj[i--];
              if ((typeof handler !== 'string' || e_o.delegate !== handler) && (event_split.length > 1 && e_o.ns && e_o.ns.match(event_split.slice(0).sort().join('.')))) {
                return;
              }
              if (typeof callback !== 'function' || callback === e_o.handler) {
                event_obj.splice(i + 1, 1);
              }
            }
            if (!event_obj.length) {
              delete o[event_split[0]];
            }
          } else {
            delete view_listenres[id];
          }
        }
        return;
      }
      return Housing.Util.stopListening_bb.apply(this, arguments);
    };
    Housing.Util.listenToOnce = function(target, event, handler) {
      var args, callback, self;
      if (target instanceof jQuery) {
        callback = arguments[arguments.length - 1];
        if (typeof callback !== 'function') {
          hlog('invalid handler', arguments);
        }
        args = arguments;
        self = this;
        arguments[arguments.length - 1] = function() {
          callback.apply(this, arguments);
          return Housing.Util.stopListening.apply(self, args);
        };
        return Housing.Util.listenTo.apply(this, arguments);
      } else {
        return Housing.Util.listenToOnce_bb.apply(this, arguments);
      }
    };
    [Backbone.View, Backbone.Model, Backbone.Collection, Backbone.History, Backbone.Router].forEach(function(b) {
      b.prototype.listenTo = Housing.Util.listenTo;
      b.prototype.listenToOnce = Housing.Util.listenToOnce;
      return b.prototype.stopListening = Housing.Util.stopListening;
    });
    Backbone.Events.listenTo = Housing.Util.listenTo;
    Backbone.Events.stopListening = Housing.Util.stopListening;
    Backbone.Events.listenToOnce = Housing.Util.listenToOnce;
    Backbone.View.prototype.stopListening = function() {
      if (!arguments.length) {
        this.undelegateEvents();
      }
      return Housing.Util.stopListening.apply(this, arguments);
    };
    Housing.Util.prefillForm = function($formEl, editable) {
      var login_name_map;
      if (editable == null) {
        editable = true;
      }
      if (!Housing.Login.logged_in) {
        return;
      }
      login_name_map = {
        name: 'name',
        email: 'email',
        phone: 'phone_number',
        country_code: 'country_code'
      };
      return $formEl.find('input').each(function(index, input) {
        var loginfield;
        loginfield = login_name_map[input.name];
        if (loginfield) {
          if (input.name === 'country_code' && Housing.Util.read_localStorage('form-data')) {
            if (JSON.parse(Housing.Util.read_localStorage('form-data')) && JSON.parse(Housing.Util.read_localStorage('form-data')).country_code) {
              input.value = JSON.parse(Housing.Util.read_localStorage('form-data')).country_code;
            }
          } else {
            if (!input.value.length) {
              input.value = Housing.Login.UserData[loginfield];
            }
          }
          if (!editable) {
            input.setAttribute('readonly', true);
            if (input.name === 'phone') {
              $(input).attr('readonly', false);
              if (input.value.length) {
                $(input).next('.edit').show();
                return $(input).attr('readonly', true);
              }
            }
          }
        }
      });
    };
    Housing.Util.check_local_data = (function(_this) {
      return function(contact_data_local) {
        if (Housing.Login && Housing.Login.UserData && contact_data_local) {
          if (!contact_data_local['name'] && Housing.Login.UserData['name']) {
            contact_data_local['name'] = Housing.Login.UserData['name'];
          }
          if (!contact_data_local['email'] && Housing.Login.UserData['email']) {
            contact_data_local['email'] = Housing.Login.UserData['email'];
          }
          if (!contact_data_local['phone'] && Housing.Login.UserData['phone_number']) {
            contact_data_local['phone'] = Housing.Login.UserData['phone_number'];
          }
        }
        return contact_data_local;
      };
    })(this);
    Housing.ajax = function(o) {
      var ref, ref1, ref2, ref3, str, success;
      if (typeof o !== 'object') {
        return;
      }
      if ((!o.xhrFields) && ((((ref = o.type) != null ? ref.toLowerCase() : void 0) === 'post') || (((ref1 = o.method) != null ? ref1.toLowerCase() : void 0) === 'post'))) {
        o.xhrFields = {
          withCredentials: true
        };
      }
      if (!o.exclude_csrf && (Housing.csrf_token && ((((ref2 = o.type) != null ? ref2.toLowerCase() : void 0) === 'post') || (((ref3 = o.method) != null ? ref3.toLowerCase() : void 0) === 'post')))) {
        o.headers = {
          'X-CSRF-TOKEN-V2': Housing.csrf_token
        };
      }
      if (o.data && (_.isObject(o.data)) && (!_.isArray(o.data)) && (!o.data.source)) {
        o.data.source = 'web';
      }
      if (o.url) {
        str = '&';
        if (o.url.indexOf('?') === -1) {
          str = '?';
        }
        o.url += str + 'source=web';
      }
      if (o.dataType === 'json' && typeof o.success === 'function') {
        success = o.success;
        o.success = function(data) {
          if (data && data.captcha_required) {
            return Housing.Util.api_captcha_reroute(this);
          } else {
            return success.apply(this, arguments);
          }
        };
      }
      return $.ajax.apply(this, arguments);
    };
    Housing.Util.getCostInWords = function(value) {
      var crores, hundreds, lacs, remainig, thousands;
      if (value || value === 0) {
        value = Math.round(value);
        crores = Math.floor(value / 10000000);
        remainig = Math.floor(value % 10000000);
        lacs = Math.floor(remainig / 100000) < 10 && crores ? '0' + Math.floor(remainig / 100000) : Math.floor(remainig / 100000);
        remainig = Math.floor(value % 100000);
        thousands = Math.floor(remainig / 1000) < 10 && lacs ? '0' + Math.floor(remainig / 1000) : Math.floor(remainig / 1000);
        remainig = Math.floor(value % 1000);
        hundreds = Math.floor(remainig / 100);
        if (crores) {
          if (!lacs) {
            return crores + ' Cr';
          } else if (lacs % 10 === 0) {
            lacs = lacs / 10;
          }
          return crores + '.' + lacs + ' Cr';
        } else if (lacs) {
          if (!thousands) {
            return lacs + ' L';
          } else if (thousands % 10 === 0) {
            thousands = thousands / 10;
          }
          return lacs + '.' + thousands + ' L';
        } else if (thousands) {
          if (!hundreds) {
            return thousands + ' K';
          }
          return thousands + '.' + hundreds + ' K';
        } else {
          return value;
        }
      }
    };
    return Housing;
  });

}).call(this);

define('backbone/assets',['backbone/utils'], function(Housing) {
  return Housing;
});

(function() {
  window.HAML.globals = function() {
    var globals;
    return globals = {
      render: function(view_name, options) {
        return window.JST[view_name](options);
      },
      image_server: function(id) {
        var index;
        if (id) {
          index = parseInt(id) % 5;
        } else {
          index = Math.floor(Math.random() * 5);
        }
        return "https://ec2-images" + index + ".housingcdn.com/";
      },
      email_validation_pattern: "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)+$",
      name_validation_pattern: "(.*[^\\s]+.*)+",
      phone_validation_pattern: "^[0-9]{3,}$",
      captcha_validation_pattern: "[0-9]+",
      is_retina: window.is_retina,

      /**
      		 * This function formats a date format or tells whether it has already passed.
      		 * @param  {string} date         The date to be formatted
      		 * @param  {bool} month_only  	 Set to true if you want to strip the date. Defaults to false
      		 * @param  {bool} force_format   If set to true, will return formatted date even if its before today
      		 * @return {string}              Formatted date or 'Ready to move' string
       */
      formatted_available_date: function(date, month_only, force_format) {
        var arr, now, return_date, sfx, time;
        if (month_only == null) {
          month_only = false;
        }
        if (force_format == null) {
          force_format = false;
        }
        time = new Date(date);
        now = new Date();
        if (time > now || force_format) {
          arr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          sfx = ["th", "st", "nd", "rd"];
          date = time.getDate();
          return_date = '';
          if (!month_only) {
            return_date += date + (sfx[(date - 20) % 10] || sfx[date] || sfx[0]) + ' ';
          }
          return_date += arr[time.getMonth()] + ', ' + time.getFullYear();
          return return_date;
        } else {
          return 'Ready to move';
        }
      },
      search_placeholder: function(service) {
        switch (service) {
          case 'buy':
            return 'Enter City, Locality, Developer or Project';
          case 'rent':
            return 'Search by locality or landmark or building';
          case 'pg':
          case 'agents':
            return 'Search by locality or landmark';
          case 'rental-agreements':
            return 'City of Property Location';
        }
      },
      formatted_date_added: function(date) {
        var arr, now, sfx, time;
        time = new Date(date);
        now = new Date();
        arr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        sfx = ["th", "st", "nd", "rd"];
        date = time.getDate();
        return date + (sfx[(date - 20) % 10] || sfx[date] || sfx[0]) + ' ' + arr[time.getMonth()] + ', ' + time.getFullYear();
      },
      formatted_age_of_property: function(age) {
        var age_of_property, date, now;
        date = new Date(age);
        now = new Date();
        age = now.getFullYear() - date.getFullYear();
        if (age === 0) {
          age_of_property = '0 to 1 year';
        } else if (age === 1) {
          age_of_property = '1 year';
        } else if (age > 1 && age < 100) {
          age_of_property = age + ' years';
        } else {
          age_of_property = '-';
        }
        return age_of_property;
      },
      formatted_age_of_property_new: function(epoch_seconds) {
        var age, age_of_property, date, now;
        date = new Date(Math.floor(epoch_seconds * 1000));
        now = new Date();
        age = now.getFullYear() - date.getFullYear();
        if (age === 0) {
          age_of_property = '0 to 1 year';
        } else if (age === 1) {
          age_of_property = '1 year';
        } else if (age > 1 && age < 100) {
          age_of_property = age + ' years';
        } else {
          age_of_property = '-';
        }
        return age_of_property;
      },
      formatted_possession_date: function(epoch_seconds) {
        var date, formatted_date, months_arr, now;
        months_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        date = new Date(Math.floor(epoch_seconds * 1000));
        now = new Date();
        if (date > now) {
          formatted_date = months_arr[date.getMonth()] + ' ' + date.getFullYear();
        } else {
          formatted_date = 'Ready to move';
        }
        return formatted_date;
      },
      formatted_added_date: function(datetime) {
        var day, delta;
        if (!datetime) {
          return '';
        }
        datetime = new Date(datetime);
        day = 1000 * 60 * 60 * 24;
        delta = Date.now() - datetime.getTime();
        if (isNaN(delta)) {
          return '';
        }
        switch (false) {
          case !(delta < day):
            return 'Today';
          case !(delta < 2 * day):
            return 'Yesterday';
          case !(delta < 30 * day):
            return parseInt(delta / day) + ' days ago';
          case !(delta < 60 * day):
            return 'About a month ago';
          case !(delta < 365 * day):
            return parseInt(delta / (30 * day)) + ' months ago';
          case !(delta < 2 * 365 * day):
            return 'About a year ago';
          default:
            return parseInt(delta / (365 * day)) + ' years ago';
        }
      },
      formatted_apt_type: function(apartment_type_id) {
        var bedroom_name, four_bedroom_ids, one_bedroom_ids, one_rk_ids, three_bedroom_ids, two_bedroom_ids;
        one_rk_ids = [1, 11];
        one_bedroom_ids = [2, 46, 47];
        two_bedroom_ids = [3, 9, 48, 52];
        three_bedroom_ids = [8, 4, 10];
        four_bedroom_ids = [5, 6, 7, 45, 44, 50, 49, 51];
        if (one_rk_ids.indexOf(apartment_type_id) !== -1) {
          bedroom_name = '1 RK';
        } else if (one_bedroom_ids.indexOf(apartment_type_id) !== -1) {
          bedroom_name = '1 BEDROOM';
        } else if (two_bedroom_ids.indexOf(apartment_type_id) !== -1) {
          bedroom_name = '2 BEDROOMS';
        } else if (three_bedroom_ids.indexOf(apartment_type_id) !== -1) {
          bedroom_name = '3 BEDROOMS';
        } else if (four_bedroom_ids.indexOf(apartment_type_id) !== -1) {
          bedroom_name = '4 BEDROOMS';
        } else {
          bedroom_name = null;
        }
        return bedroom_name;
      },
      is_property_new: function(ISO_date_string) {
        var d1, d2, time_now;
        time_now = new Date();
        d1 = new Date(ISO_date_string);
        d2 = new Date(time_now.toISOString());
        return parseInt((d2 - d1) / (1000 * 3600 * 24)) < 15;
      },
      comma_formatted: function(amount) {
        var a, an, delimiter, i, len, n, nn, ref;
        delimiter = ",";
        if (typeof amount !== 'string') {
          amount = amount.toString();
        }
        if ((0 < (ref = parseFloat(amount)) && ref < 1)) {
          return parseFloat(amount).toFixed(3);
        }
        a = amount.split('.', 2);
        i = parseInt(a[0]);
        i = Math.abs(i);
        n = new String(i);
        a = [];
        len = n.length;
        if (len > 3) {
          nn = n.substr(n.length - 3);
          a.unshift(nn);
          n = n.substr(0, n.length - 3);
          while (n.length > 2) {
            an = n.substr(n.length - 2);
            a.unshift(an);
            n = n.substr(0, n.length - 2);
          }
          if (n.length > 0) {
            a.unshift(n);
          }
          n = a.join(delimiter);
        }
        return n;
      },
      get_discounted_value: function(amount, discount) {
        var discounted_price;
        if (isNaN(parseInt(discount)) || parseInt(discount) > 100) {
          return false;
        }
        discounted_price = parseInt(amount * (1 - (discount / 100)));
        return discounted_price;
      },
      get_price_with_unit: function(min_val, max_val) {
        var max_price, max_price_with_unit, min_price, min_price_with_unit, price_range;
        price_range = {};
        min_price_with_unit = min_val.trim().split(" ");
        min_price = {
          value: min_price_with_unit[0],
          unit: min_price_with_unit[1]
        };
        price_range.min_price = min_price;
        if (!!max_val && max_val !== min_val) {
          max_price_with_unit = max_val.trim().split(" ");
          max_price = {
            value: max_price_with_unit[0],
            unit: max_price_with_unit[1]
          };
          price_range.max_price = max_price;
        }
        return price_range;
      },
      format_money: function(val, k_prec, l_prec, c_prec) {
        var cr, f_val, k, lac, multiplier, new_val, unit;
        if (k_prec == null) {
          k_prec = 0;
        }
        if (l_prec == null) {
          l_prec = 0;
        }
        if (c_prec == null) {
          c_prec = 0;
        }
        cr = 10000000;
        lac = 100000;
        k = 1000;
        multiplier = 1;
        val = parseInt(val);
        if (val >= cr) {
          unit = 'Crs';
          multiplier = cr;
          if (val - cr < cr) {
            new_val = parseFloat(val / cr).toFixed(2);
          } else {
            new_val = parseFloat(val / cr).toFixed(c_prec);
          }
          if (parseInt(new_val) === 1) {
            unit = 'Cr';
          }
        } else if (val >= lac) {
          unit = 'Lacs';
          multiplier = lac;
          if (val - lac < lac) {
            new_val = parseFloat(val / lac).toFixed(2);
          } else {
            new_val = parseFloat(val / lac).toFixed(l_prec);
          }
          if (parseInt(new_val) === 1) {
            unit = 'Lac';
          }
        } else if (val >= k) {
          unit = 'K';
          multiplier = k;
          new_val = parseFloat(val / k).toFixed(k_prec);
        } else {
          unit = '';
          new_val = val;
        }
        f_val = new_val + ' ' + unit;
        return f_val;
      },
      get_image_url: function(url, version, to_replace) {
        if (to_replace == null) {
          to_replace = 'version';
        }
        if (url && version) {
          return url.replace(to_replace, version);
        } else {
          return "";
        }
      },
      get_min_emi: function(property_price) {
        var factor, interest_rate, loan_amount, no_of_periods, tenure;
        loan_amount = parseInt(property_price) * 0.8;
        tenure = 30;
        interest_rate = 9.90;
        interest_rate /= 1200;
        no_of_periods = 12 * tenure;
        factor = Math.pow(1 + interest_rate, no_of_periods);
        return this.getCostInWords(interest_rate * loan_amount * factor / (factor - 1));
      },
      sort_bhks: function(arr) {
        var order_of_bhks;
        order_of_bhks = ['1 RK', '1 BEDROOM', '1 BHK', '1.5 BHK', '2 BEDROOM', '2 BHK', '2.5 BHK', '3 BEDROOM', '3 BHK', '3.5 BHK', '4 BEDROOM', '4 BHK', '4.5 BHK', '5 BHK', '5+ BHK'];
        return arr.sort(function(a, b) {
          if (order_of_bhks.indexOf(a) === -1) {
            return 1;
          }
          return order_of_bhks.indexOf(a) - order_of_bhks.indexOf(b);
        });
      },
      currency_format: function(amount) {
        var str, suffix;
        if (amount != null) {
          amount = parseInt(amount);
          suffix = '';
          if (amount >= 1000) {
            str = amount.toString();
            suffix = ',' + str.substr(str.length - 3, str.length - 1);
            amount = parseInt(amount / 1000);
            while (amount >= 100) {
              str = amount.toString();
              suffix = ',' + str.substr(str.length - 2, str.length - 1) + suffix;
              amount = parseInt(amount / 100);
            }
          }
          return amount + suffix;
        }
      },
      getCostInWords: function(value) {
        var crores, hundreds, lacs, remainig, thousands;
        if (value || value === 0) {
          value = Math.round(value);
          crores = Math.floor(value / 10000000);
          remainig = Math.floor(value % 10000000);
          lacs = Math.floor(remainig / 100000) < 10 && crores ? '0' + Math.floor(remainig / 100000) : Math.floor(remainig / 100000);
          remainig = Math.floor(value % 100000);
          thousands = Math.floor(remainig / 1000) < 10 && lacs ? '0' + Math.floor(remainig / 1000) : Math.floor(remainig / 1000);
          remainig = Math.floor(value % 1000);
          hundreds = Math.floor(remainig / 100);
          if (crores) {
            if (!lacs) {
              return crores + ' Cr';
            }
            return crores + '.' + lacs + ' Cr';
          } else if (lacs) {
            if (!thousands) {
              return lacs + ' Lacs';
            }
            return lacs + '.' + thousands + ' Lacs';
          } else if (thousands) {
            if (!hundreds) {
              return thousands + ' K';
            }
            return thousands + '.' + hundreds + ' K';
          } else {
            return value;
          }
        }
      },
      get_floor_level: function(floor_number, floor_count) {
        var floor_fraction;
        if (floor_count < 3) {
          switch (floor_number) {
            case 0:
              return 'Ground Floor';
            case 1:
              return 'First Floor';
          }
        }
        floor_fraction = floor_number / floor_count;
        switch (false) {
          case !(floor_fraction <= 1 / 3):
            return "Lower of " + floor_count + " floors";
          case !(floor_fraction <= 2 / 3):
            return "Middle of " + floor_count + " floors";
          default:
            return "Higher of " + floor_count + " floors";
        }
      },
      capitalize: function(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      },

      /**
      		 * This function converts the image url received from the backed to a valid image url.
      		 * Converts 'version.jpg' to '_m.jpg' for project
      		 * Converts 'version.jpg' to 'medium.jpg' for resale
      		 * @param  {string} url     The url that is received from the API
      		 * @param  {string} service 'resale' or 'project'
      		 * @return {string}         The valid url
       */
      format_image_url: function(url, service) {
        var modified_url;
        return modified_url = url.replace(/version\.jpg/gi, function(matchedString) {
          if (service === 'resale') {
            return 'medium.jpg';
          } else {
            return '_m.jpg';
          }
        });
      },

      /**
      		 * tells whether the project is a new launch or not
      		 * @param  {number}  epoch_seconds    Initiation time in seconds
      		 * @param  {number}  months_threshold Months threshold for being in the new launch category. Defaults to 3
      		 * @return {Boolean}                  'true' if new launch else 'false'
       */
      is_new_launch: function(epoch_seconds, months_threshold) {
        var months_in_sec, time_difference, today_epoch;
        if (months_threshold == null) {
          months_threshold = 3;
        }
        today_epoch = Math.floor(new Date().getTime() / 1000);
        months_in_sec = months_threshold * 30 * 24 * 60 * 60;
        time_difference = Math.abs(today_epoch - epoch_seconds);
        return time_difference < months_in_sec;
      },
      get_suffix_for_number: function(number) {
        var j, k, suffix;
        if (!isNaN(number) && number >= 0) {
          number = parseInt(number);
          j = number % 10;
          k = number % 100;
          suffix = '';
          if (j === 1 && k !== 11) {
            return suffix = 'st';
          } else if (j === 2 && k !== 12) {
            return suffix = 'nd';
          } else if (j === 3 && k !== 13) {
            return suffix = 'rd';
          } else {
            return suffix = 'th';
          }
        }
      },
      group_array: function(array, n) {
        return _.chain(array).groupBy(function(element, index) {
          return Math.floor(index / n);
        }).toArray().value();
      },
      filter_contact_persons_info: function(listing) {
        var pinned_brokers_present_flag;
        pinned_brokers_present_flag = listing.pinned_brokers_present;
        return listing.filtered_contact_persons_info = _.filter(listing.contact_persons_info, function(contact) {
          if (pinned_brokers_present_flag) {
            return contact.contact_person_id === 1;
          } else {
            return !contact.not_in_contact_card;
          }
        });
      },
      base_64_encode: function(str) {
        if (window && window.btoa) {
          return window.btoa(str);
        } else if (typeof Buffer === 'function') {
          return new Buffer(str).toString('base64');
        }
      },
      get_collection_link: function(key, name) {
        if (key && name) {
          switch (key) {
            case 1:
              return "luxury-" + name;
            case 2:
              return "value-" + name;
            case 3:
              return "township-" + name;
            case 4:
              return "sporting_amenities-" + name;
            case 5:
              return "open_space-" + name;
            case 6:
              return "ready_to_move_projects-" + name;
          }
        }
      },
      adjust_number_to_nearest_multiple: function(length, adjusted) {
        if (adjusted == null) {
          adjusted = 2;
        }
        return length - length % adjusted;
      },
      static_map_url: function(lat, lng, size, zoom) {
        if (zoom == null) {
          zoom = 12;
        }
        return "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lng + "&zoom=" + zoom + "&size=" + size + "&key=AIzaSyBmXkFXGGXk_2zgOOzOFa9Tgaan-iVK08s";
      }
    };
  };

}).call(this);

define("templates/context", function(){});

(function() {
  define('backbone/helpers/rental_agreements/string_formatter',[], function() {
    var RAStringFormatter, unescapeMap;
    unescapeMap = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'"
    };
    RAStringFormatter = {
      escaper: function(match) {
        return unescapeMap[match];
      },
      unescape: function(string) {
        var replaceRegexp, source, testRegexp;
        source = '(?:' + _.keys(unescapeMap).join('|') + ')';
        testRegexp = RegExp(source);
        replaceRegexp = RegExp(source, 'g');
        if (string == null) {
          return '';
        }
        string = '' + string;
        if (testRegexp.test(string)) {
          return string.replace(replaceRegexp, this.escaper);
        } else {
          return string;
        }
      },
      get_ordinal: function(number) {
        var num_str, postfix;
        number = String(number);
        num_str = number.substr(-2);
        if (num_str.length === 1) {
          num_str = '0' + num_str;
        }
        postfix = (function() {
          switch (num_str.charAt(1)) {
            case '0':
              return 'th';
            case '1':
              switch (num_str.charAt(0)) {
                case '1':
                  return 'th';
                default:
                  return 'st';
              }
              break;
            case '2':
              switch (num_str.charAt(0)) {
                case '1':
                  return 'th';
                default:
                  return 'nd';
              }
              break;
            case '3':
              switch (num_str.charAt(0)) {
                case '1':
                  return 'th';
                default:
                  return 'rd';
              }
              break;
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
              return 'th';
          }
        })();
        number = number.replace(/^0*/, '');
        return number + postfix;
      },
      date_to_string: function(date_string) {
        var day_ordinal, month, month_name, splits, year;
        splits = date_string.split('/');
        day_ordinal = this.get_ordinal(parseInt(splits[0]));
        month = splits[1];
        month_name = ['December', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][parseInt(month)];
        year = splits[2];
        return day_ordinal + ' day of ' + month_name + ' ' + year;
      },
      two_digit_tostring: function(number) {
        var ones, ones_str, tens, tens_str;
        ones_str = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        tens_str = ["", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
        tens = Math.floor(number / 10);
        ones = number - tens * 10;
        if (tens < 2) {
          return ones_str[tens * 10 + ones];
        }
        if (ones > 0) {
          return tens_str[tens] + '-' + ones_str[ones];
        }
        return tens_str[tens];
      },
      num_to_string: function(number) {
        var crores, hundreds, lakhs, res, thousands;
        number = parseInt(number.replace(/[\, ]/g, ''));
        if (number < 0 || number > 999999999) {
          return '';
        }
        res = '';
        crores = Math.floor(number / 10000000);
        number -= crores * 10000000;
        if (crores > 0) {
          res += this.two_digit_tostring(crores) + ' Crore';
        }
        lakhs = Math.floor(number / 100000);
        number -= lakhs * 100000;
        if (lakhs > 0) {
          if (res) {
            res = res + ' ';
          }
          res += this.two_digit_tostring(lakhs) + ' Lakh';
        }
        thousands = Math.floor(number / 1000);
        number -= thousands * 1000;
        if (thousands > 0) {
          if (res) {
            res = res + ' ';
          }
          res += this.two_digit_tostring(thousands) + ' Thousand';
        }
        hundreds = Math.floor(number / 100);
        number -= hundreds * 100;
        if (hundreds > 0) {
          if (res) {
            res = res + ' ';
          }
          res += this.two_digit_tostring(hundreds) + ' Hundred';
        }
        if (number > 0) {
          if (res) {
            res = res + ' and ';
          }
          res += this.two_digit_tostring(number);
        }
        if (!res) {
          res = 'zero';
        }
        return res + ' only';
      }
    };
    return RAStringFormatter;
  });

}).call(this);

(function() {
  if (window.JST == null) {
    window.JST = {};
  }

  window.JST['rental_agreements/preview_form'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div class='fixed-mode ra-preview-inner'>\n<div class='ra-stamp'>\n<svg id='Layer_1' enable-background='new 0 0 720 320' version='1.1' viewBox='0 0 720 320' x='0px' xml:space='preserve' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' y='0px'>\n<g>\n<rect fill='#FFFFFF' height='317.8' width='718.7' x='0.9' y='1.2'>\n<path d='M719.5,319.4H0.9c-0.3,0-0.5-0.2-0.5-0.5V1.2c0-0.3,0.2-0.5,0.5-0.5h718.7c0.3,0,0.5,0.2,0.5,0.5v317.8\n\t\tC720,319.2,719.8,319.4,719.5,319.4z M1.3,318.5h717.8V1.6H1.3V318.5z' fill='#EABFD2'></path>\n</rect>\n</g>\n<g>\n<rect fill='#FFFFFF' height='208.1' width='605' x='57.8' y='55.3'>\n<path d='M662.8,263.9h-605c-0.3,0-0.5-0.2-0.5-0.5V55.3c0-0.3,0.2-0.5,0.5-0.5h605c0.3,0,0.5,0.2,0.5,0.5v208.1\n\t\tC663.2,263.7,663,263.9,662.8,263.9z M58.3,262.9h604.1V55.7H58.3V262.9z' fill='#E3AAC3'></path>\n</rect>\n</g>\n<g>\n<g>\n<path d='M90.3,17.9c-0.2,0-0.3,0-0.3,0c-2.8-0.2-6.8-3.6-7.2-4C70.6,2.9,57.3,3.1,57.2,3.1\n\t\t\tc-14.7,0.3-24,7.4-28.9,11.2c-1.1,0.8-2,1.5-2.7,1.9c-4.1,2.4-9.9,0.5-10.1,0.5c-0.5-0.2-0.7-0.7-0.6-1.1c0.2-0.5,0.7-0.7,1.1-0.6\n\t\t\tc0.1,0,5.3,1.7,8.6-0.3c0.6-0.4,1.5-1,2.5-1.8c5.1-3.9,14.7-11.3,30-11.6C57.7,1.3,71.3,1,84,12.6c1.1,0.9,4.3,3.4,6.2,3.5\n\t\t\tc0.1,0,1.7,0.1,3.8-1.8c4.2-4,18.1-14.1,31.3-13c0.5,0,0.9,0.5,0.8,1c0,0.5-0.5,0.9-1,0.8c-12.5-1-25.8,8.7-29.9,12.5\n\t\t\tC93,17.7,91,17.9,90.3,17.9z' fill='#E3AAC3'></path>\n</g>\n</g>\n<g>\n<path d='M627.5,17.9c-0.7,0-2.7-0.2-4.9-2.3c-4.1-3.8-17.4-13.5-29.9-12.5c-0.5,0-0.9-0.3-1-0.8\n\t\t\tc0-0.5,0.3-0.9,0.8-1c15.9-1.3,31.1,12.9,31.3,13c2.1,2,3.7,1.8,3.8,1.8c1.9-0.1,5.2-2.6,6.3-3.5C646.5,1,660.1,1.3,660.7,1.3\n\t\t\tc15.3,0.3,24.9,7.7,30,11.6c1.1,0.8,1.9,1.5,2.5,1.8c3.3,2,8.6,0.3,8.6,0.3c0.5-0.2,1,0.1,1.2,0.6c0.2,0.5-0.1,1-0.6,1.1\n\t\t\tc-0.2,0.1-6.1,2-10.1-0.5c-0.7-0.4-1.6-1.1-2.7-1.9c-5-3.8-14.3-10.9-28.9-11.2c-0.1,0-13.5-0.2-25.6,10.8c-0.5,0.4-4.5,3.8-7.3,4\n\t\t\tC627.7,17.9,627.6,17.9,627.5,17.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M157.2,17.9c-0.2,0-0.3,0-0.3,0c-2.8-0.2-6.8-3.6-7.2-4C137.5,2.9,124.2,3.1,124.1,3.1\n\t\t\tc-0.6,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.6,0,14.2-0.2,26.9,11.3c1.1,0.9,4.3,3.4,6.2,3.5c0.1,0,1.7,0.1,3.8-1.8\n\t\t\tc0.2-0.1,15.4-14.3,31.3-13c0.5,0,0.9,0.5,0.8,1c0,0.5-0.5,0.9-1,0.8c-12.5-1-25.8,8.7-29.9,12.5\n\t\t\tC159.9,17.7,157.9,17.9,157.2,17.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M223.8,17.9c-0.2,0-0.3,0-0.3,0c-2.8-0.2-6.8-3.6-7.2-4C204.2,2.9,190.9,3.1,190.7,3.1\n\t\t\tc-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.6,0,14.2-0.2,26.9,11.3c1.1,0.9,4.3,3.4,6.2,3.5c0.1,0,1.7,0.1,3.8-1.8\n\t\t\tc4.2-4,18.1-14.1,31.3-13c0.5,0,0.9,0.5,0.8,1c0,0.5-0.5,0.9-1,0.8c-12.5-1-25.8,8.7-29.9,12.5C226.6,17.7,224.6,17.9,223.8,17.9z\n\t\t\t' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M290.5,17.9c-0.2,0-0.3,0-0.3,0c-2.8-0.2-6.8-3.6-7.2-4C270.8,2.9,257.5,3.1,257.3,3.1\n\t\t\tc-0.4,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.6,0,14.2-0.2,26.9,11.3c1.1,0.9,4.3,3.4,6.2,3.5c0.1,0,1.7,0.1,3.8-1.8\n\t\t\tc4.2-4,18.1-14.1,31.3-13c0.5,0,0.9,0.5,0.8,1c0,0.5-0.5,0.9-1,0.8c-12.5-1-25.8,8.7-29.9,12.5C293.2,17.7,291.2,17.9,290.5,17.9z\n\t\t\t' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M357.1,17.9c-0.2,0-0.3,0-0.3,0c-2.8-0.2-6.8-3.6-7.2-4C337.4,2.9,324,3.1,323.9,3.1\n\t\t\tc-0.4,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.6,0,14.2-0.2,26.9,11.3c1.1,0.9,4.3,3.4,6.2,3.5c0.1,0,1.7,0.1,3.8-1.8\n\t\t\tc0.2-0.1,15.4-14.3,31.3-13c0.5,0,0.9,0.5,0.8,1c0,0.5-0.5,0.9-1,0.8c-12.6-1-25.8,8.7-29.9,12.5\n\t\t\tC359.8,17.7,357.8,17.9,357.1,17.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M423.7,17.9c-0.2,0-0.3,0-0.3,0c-2.8-0.2-6.8-3.6-7.2-4C404,2.9,390.7,3.1,390.5,3.1c0,0,0,0,0,0\n\t\t\tc-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.6,0,14.2-0.2,26.9,11.3c1.1,0.9,4.3,3.4,6.2,3.5c0.1,0,1.7,0.1,3.8-1.8\n\t\t\tc0.2-0.1,15.3-14.3,31.3-13c0.5,0,0.9,0.5,0.8,1c0,0.5-0.5,0.9-1,0.8c-12.5-1-25.8,8.7-29.9,12.5\n\t\t\tC426.4,17.7,424.4,17.9,423.7,17.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M490.3,17.9c-0.2,0-0.3,0-0.3,0c-2.8-0.2-6.8-3.6-7.2-4c-12.1-11-25.5-10.8-25.6-10.8\n\t\t\tc-0.5,0.1-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.6,0,14.2-0.2,26.9,11.3c1.1,0.9,4.3,3.4,6.2,3.5c0.1,0,1.7,0.1,3.8-1.8\n\t\t\tc0.2-0.1,15.3-14.3,31.3-13c0.5,0,0.9,0.5,0.8,1c0,0.5-0.5,0.9-1,0.8c-12.5-1-25.8,8.7-29.9,12.5C493,17.7,491,17.9,490.3,17.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M556.9,17.9c-0.2,0-0.3,0-0.3,0c-2.8-0.2-6.8-3.6-7.2-4C537.2,2.9,523.9,3.1,523.8,3.1c0,0,0,0,0,0\n\t\t\tc-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-0.9,0.9-0.9c0.6,0,14.2-0.2,26.9,11.3c1.1,0.9,4.3,3.4,6.2,3.5c0.1,0,1.7,0.1,3.8-1.8\n\t\t\tc0.2-0.1,15.3-14.3,31.3-13c0.5,0,0.9,0.5,0.8,1c0,0.5-0.5,0.9-1,0.8c-12.5-1-25.8,8.7-29.9,12.5\n\t\t\tC559.6,17.7,557.6,17.9,556.9,17.9z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M90.3,23.9c-0.1,0-0.2,0-0.2,0c-2.7-0.2-6.8-4.1-7-4.3C70.8,7.4,57.3,7.6,57.1,7.6\n\t\t\t\tC42.3,7.9,33,15.8,28,20.1c-1.1,0.9-2,1.7-2.6,2.1c-3.9,2.6-9.5,0.6-9.8,0.5c-0.2-0.1-0.4-0.3-0.3-0.6c0.1-0.2,0.4-0.4,0.6-0.3\n\t\t\t\tc0.1,0,5.5,2,9-0.4c0.6-0.4,1.5-1.1,2.6-2C32.5,15.1,42,7,57.1,6.7c0.2,0,14-0.3,26.6,12.3c0,0,4,3.8,6.5,4c0,0,1.9,0.2,4.1-2.1\n\t\t\t\tc4.2-4.3,17.9-15.3,30.9-14.2c0.3,0,0.4,0.2,0.4,0.5c0,0.2-0.2,0.5-0.5,0.4C112.5,6.5,99.1,17.3,95,21.5\n\t\t\t\tC92.8,23.7,91,23.9,90.3,23.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M627.5,23.9c-0.6,0-2.5-0.2-4.6-2.4c-4.1-4.2-17.5-15-30.2-13.9c-0.2,0-0.5-0.2-0.5-0.4\n\t\t\t\tc0-0.3,0.2-0.5,0.4-0.5c0.6-0.1,1.3-0.1,1.9-0.1c12.4,0,25,10.1,29,14.3c2.2,2.3,4.1,2.1,4.1,2.1c2.5-0.2,6.5-4,6.5-4\n\t\t\t\tc12.6-12.6,26.4-12.3,26.6-12.3c15.1,0.3,24.6,8.4,29.8,12.7c1.1,0.9,1.9,1.6,2.6,2c3.5,2.3,8.9,0.4,9,0.4c0.2-0.1,0.5,0,0.6,0.3\n\t\t\t\tc0.1,0.2,0,0.5-0.3,0.6c-0.2,0.1-5.9,2.1-9.8-0.5c-0.7-0.5-1.5-1.2-2.6-2.1c-5-4.2-14.4-12.1-29.2-12.5c-0.2,0-13.7-0.2-25.9,12\n\t\t\t\tc-0.2,0.2-4.3,4-7,4.3C627.7,23.9,627.6,23.9,627.5,23.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M157.2,23.9c-0.1,0-0.2,0-0.2,0c-2.7-0.2-6.8-4.1-7-4.3c-12.3-12.3-25.8-12-25.9-12.1c0,0,0,0,0,0\n\t\t\t\tc-0.2,0-0.4-0.2-0.5-0.4c0-0.3,0.2-0.5,0.4-0.5c0.1,0,14-0.3,26.6,12.3c0,0,4,3.8,6.5,4c0,0,1.9,0.2,4.1-2.1\n\t\t\t\tc4.2-4.3,17.9-15.3,30.9-14.2c0.3,0,0.4,0.2,0.4,0.5c0,0.2-0.2,0.5-0.5,0.4c-12.6-1.1-26.1,9.7-30.2,13.9\n\t\t\t\tC159.8,23.7,157.9,23.9,157.2,23.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M223.9,23.9c-0.1,0-0.2,0-0.2,0c-2.7-0.2-6.8-4.1-7-4.3c-12.3-12.3-25.8-12-25.9-12.1c0,0,0,0,0,0\n\t\t\t\tc-0.2,0-0.4-0.2-0.5-0.4c0-0.3,0.2-0.5,0.4-0.5c0.2,0,14-0.3,26.6,12.3c0,0,4,3.8,6.5,4c0.1,0,1.9,0.2,4.1-2.1\n\t\t\t\tc4.2-4.3,17.9-15.3,30.9-14.2c0.3,0,0.4,0.2,0.4,0.5c0,0.2-0.2,0.5-0.5,0.4c-12.7-1.1-26.1,9.7-30.2,13.9\n\t\t\t\tC226.4,23.7,224.5,23.9,223.9,23.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M290.5,23.9c-0.1,0-0.2,0-0.2,0c-2.7-0.2-6.8-4.1-7-4.3C270.9,7.4,257.4,7.6,257.3,7.6\n\t\t\t\tc-0.2,0-0.5-0.2-0.5-0.4c0-0.3,0.2-0.5,0.4-0.5c0.2,0,14-0.3,26.6,12.3c0,0,4,3.8,6.5,4c0,0,1.9,0.2,4.1-2.1\n\t\t\t\tc4.2-4.3,17.9-15.3,30.9-14.2c0.3,0,0.4,0.2,0.4,0.5c0,0.2-0.2,0.5-0.5,0.4c-12.7-1.1-26.1,9.7-30.2,13.9\n\t\t\t\tC293,23.7,291.1,23.9,290.5,23.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M357.1,23.9c-0.1,0-0.2,0-0.2,0c-2.7-0.2-6.8-4.1-7-4.3C337.6,7.4,324,7.6,323.9,7.6\n\t\t\t\tc-0.3,0-0.5-0.2-0.5-0.4c0-0.3,0.2-0.5,0.4-0.5c0.1,0,14-0.3,26.6,12.3c0,0,4,3.8,6.5,4c0,0,1.9,0.2,4.1-2.1\n\t\t\t\tC365.3,16.5,379,5.6,392,6.7c0.3,0,0.4,0.2,0.4,0.5c0,0.2-0.2,0.4-0.5,0.4c0,0,0,0,0,0c-0.6-0.1-1.3-0.1-1.9-0.1\n\t\t\t\tc-12.1,0-24.4,9.9-28.3,14C359.6,23.7,357.7,23.9,357.1,23.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M423.7,23.9c-0.1,0-0.2,0-0.2,0c-2.7-0.2-6.8-4.1-7-4.3C404.7,7.9,391.9,7.6,390.6,7.6\n\t\t\t\tc-0.1,0-0.1,0-0.1,0c-0.2,0-0.4-0.2-0.5-0.4c0-0.3,0.2-0.5,0.4-0.5c0,0,0,0,0.1,0c1.3,0,14.5,0.3,26.5,12.3c0,0,4,3.8,6.5,4\n\t\t\t\tc0,0,1.9,0.2,4.1-2.1c4-4.1,16.6-14.3,29-14.3c0.7,0,1.3,0,1.9,0.1c0.3,0,0.4,0.2,0.4,0.5c0,0.3-0.3,0.4-0.5,0.4\n\t\t\t\tc-12.7-1.1-26.1,9.7-30.2,13.9C426.2,23.7,424.4,23.9,423.7,23.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M490.3,23.9c-0.1,0-0.2,0-0.2,0c-2.7-0.2-6.8-4.1-7-4.3C471.3,7.9,458.5,7.6,457.2,7.6\n\t\t\t\tc-0.1,0-0.1,0-0.1,0c-0.2,0-0.4-0.2-0.5-0.4c0-0.3,0.2-0.5,0.4-0.5c0.2,0,14.1-0.3,26.6,12.3c0,0,4,3.8,6.5,4\n\t\t\t\tc0,0,1.9,0.2,4.1-2.1c4-4.1,16.6-14.3,29-14.3c0.7,0,1.3,0,1.9,0.1c0.3,0,0.4,0.2,0.4,0.5c0,0.3-0.3,0.4-0.5,0.4\n\t\t\t\tc-12.7-1.1-26.1,9.7-30.2,13.9C492.8,23.7,491,23.9,490.3,23.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M556.9,23.9c-0.1,0-0.2,0-0.2,0c-2.7-0.2-6.8-4.1-7-4.3c-12.3-12.3-25.8-12-25.9-12.1c0,0,0,0,0,0\n\t\t\t\tc-0.2,0-0.4-0.2-0.5-0.4c0-0.3,0.2-0.5,0.4-0.5c0.1,0,14.1-0.3,26.6,12.3c0,0,4,3.8,6.5,4c0,0,1.9,0.2,4.1-2.1\n\t\t\t\tc4-4.1,16.6-14.3,29-14.3c0.7,0,1.3,0,1.9,0.1c0.3,0,0.4,0.2,0.4,0.5c0,0.3-0.3,0.4-0.5,0.4c-0.6-0.1-1.3-0.1-1.9-0.1\n\t\t\t\tc-12.1,0-24.4,9.9-28.3,14C559.4,23.7,557.6,23.9,556.9,23.9z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M123.2,317.1c-15.1,0-29.1-12.9-29.2-13.1c-2.1-2-3.7-1.8-3.8-1.8c-1.9,0.1-5.2,2.6-6.3,3.5\n\t\t\tC71.3,317.3,57.7,317,57.1,317c-15.3-0.3-24.8-7.7-30-11.6c-1.1-0.8-1.9-1.5-2.5-1.8c-3.4-2-8.6-0.3-8.6-0.3\n\t\t\tc-0.5,0.2-1-0.1-1.2-0.6c-0.2-0.5,0.1-1,0.6-1.2c0.2-0.1,6.1-2,10.1,0.5c0.7,0.4,1.6,1.1,2.7,1.9c5,3.8,14.3,10.9,28.9,11.2\n\t\t\tc0.1,0,13.5,0.2,25.6-10.8c0.5-0.4,4.5-3.8,7.3-4c0.1,0,2.4-0.3,5.2,2.3c4.1,3.8,17.3,13.5,29.9,12.5c0.5-0.1,0.9,0.3,1,0.8\n\t\t\tc0,0.5-0.3,0.9-0.8,1C124.6,317.1,123.9,317.1,123.2,317.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M594.6,317.1c-0.7,0-1.4,0-2.1-0.1c-0.5,0-0.9-0.5-0.8-1s0.5-0.9,1-0.8c12.4,1,25.8-8.7,29.9-12.5\n\t\t\tc2.7-2.6,5.1-2.3,5.2-2.3c2.8,0.2,6.8,3.6,7.2,4c12.1,11,25.6,10.9,25.6,10.8c14.7-0.3,24-7.4,28.9-11.2c1.1-0.8,2-1.5,2.7-1.9\n\t\t\tc4.1-2.4,9.9-0.5,10.1-0.5c0.5,0.2,0.7,0.7,0.6,1.2c-0.2,0.5-0.7,0.7-1.2,0.6c0,0-5.3-1.7-8.6,0.3c-0.6,0.4-1.5,1-2.5,1.8\n\t\t\tc-5.1,4-14.7,11.3-30,11.6c-0.5,0-14.2,0.3-26.9-11.3c-1.1-0.9-4.3-3.4-6.2-3.5c-0.1,0-1.7-0.1-3.8,1.8\n\t\t\tC623.6,304.2,609.7,317.1,594.6,317.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M190.1,317.1c-15.1,0-29.1-12.9-29.2-13.1c-2.1-2-3.7-1.8-3.8-1.8c-1.9,0.1-5.2,2.6-6.3,3.5\n\t\t\tC138.2,317.3,124.6,317,124,317c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.5-0.9,0.9-0.9c0.2,0,13.5,0.2,25.6-10.8c0.5-0.4,4.5-3.8,7.3-4\n\t\t\tc0.1,0,2.4-0.3,5.2,2.3c4.1,3.8,17.4,13.5,29.9,12.5c0.5-0.1,0.9,0.3,1,0.8c0,0.5-0.3,0.9-0.8,1\n\t\t\tC191.5,317.1,190.8,317.1,190.1,317.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M256.8,317.1c-15.1,0-29.1-12.9-29.2-13.1c-2.1-2-3.7-1.8-3.8-1.8c-1.9,0.1-5.2,2.6-6.3,3.5\n\t\t\tc-12.7,11.5-26.3,11.3-26.9,11.3c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.5-0.9,0.9-0.9c0.2,0,13.5,0.2,25.6-10.8c0.5-0.4,4.5-3.8,7.3-4\n\t\t\tc0.1,0,2.4-0.3,5.2,2.3c4.1,3.8,17.4,13.5,29.9,12.5c0.5-0.1,0.9,0.3,1,0.8c0,0.5-0.3,0.9-0.8,1\n\t\t\tC258.1,317.1,257.4,317.1,256.8,317.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M323.4,317.1c-15.1,0-29.1-12.9-29.2-13.1c-2.1-2-3.7-1.8-3.8-1.8c-1.9,0.1-5.2,2.6-6.3,3.5\n\t\t\tc-12.7,11.5-26.3,11.3-26.9,11.3c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.5-0.9,0.9-0.9c0.2,0,13.5,0.2,25.6-10.8c0.5-0.4,4.5-3.8,7.3-4\n\t\t\tc0.1,0,2.4-0.3,5.2,2.3c4.1,3.8,17.4,13.5,29.9,12.5c0.5-0.1,0.9,0.3,1,0.8c0,0.5-0.3,0.9-0.8,1\n\t\t\tC324.7,317.1,324.1,317.1,323.4,317.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M390,317.1c-15.1,0-29.1-12.9-29.2-13.1c-2.1-2-3.7-1.8-3.8-1.8c-1.9,0.1-5.2,2.6-6.3,3.5\n\t\t\tc-12.7,11.5-26.3,11.3-26.9,11.3c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.5-0.9,0.9-0.9c0.2,0,13.5,0.2,25.6-10.8c0.5-0.4,4.5-3.8,7.3-4\n\t\t\tc0.1,0,2.4-0.3,5.2,2.3c4.1,3.8,17.4,13.5,29.9,12.5c0.5-0.1,0.9,0.3,1,0.8c0,0.5-0.3,0.9-0.8,1\n\t\t\tC391.4,317.1,390.7,317.1,390,317.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M456.6,317.1c-15.1,0-29.1-12.9-29.2-13.1c-2.1-2-3.7-1.8-3.8-1.8c-1.9,0.1-5.2,2.6-6.3,3.5\n\t\t\tc-12.7,11.5-26.3,11.3-26.9,11.3c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-1,0.9-0.9c0.1,0,13.5,0.2,25.6-10.8c0.5-0.4,4.5-3.8,7.3-4\n\t\t\tc0,0,2.4-0.3,5.2,2.3c4.1,3.8,17.4,13.5,29.9,12.5c0.5-0.1,0.9,0.3,1,0.8c0,0.5-0.3,0.9-0.8,1C458,317.1,457.3,317.1,456.6,317.1z\n\t\t\t' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M523.2,317.1c-15.1,0-29.1-12.9-29.2-13.1c-2.1-2-3.7-1.8-3.8-1.8c-1.9,0.1-5.2,2.6-6.3,3.5\n\t\t\tc-12.7,11.5-26.3,11.3-26.9,11.3c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-1,0.9-0.9c0.1,0,13.5,0.2,25.6-10.8c0.5-0.4,4.5-3.8,7.3-4\n\t\t\tc0,0,2.4-0.3,5.2,2.3c4.1,3.8,17.5,13.6,29.9,12.5c0.5-0.1,0.9,0.3,1,0.8c0,0.5-0.3,0.9-0.8,1\n\t\t\tC524.6,317.1,523.9,317.1,523.2,317.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M589.8,317.1c-15.1,0-29.1-12.9-29.2-13.1c-2.1-2-3.7-1.8-3.8-1.8c-1.9,0.1-5.2,2.6-6.3,3.5\n\t\t\tc-12.7,11.5-26.3,11.3-26.9,11.3c-0.5,0-0.9-0.4-0.9-0.9c0-0.5,0.4-1,0.9-0.9c0.1,0,13.5,0.2,25.6-10.8c0.5-0.4,4.5-3.8,7.3-4\n\t\t\tc0,0,2.4-0.3,5.2,2.3c4.1,3.8,17.4,13.5,29.9,12.5c0.5-0.1,0.9,0.3,1,0.8c0,0.5-0.3,0.9-0.8,1\n\t\t\tC591.2,317.1,590.5,317.1,589.8,317.1z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M123.3,311.7c-12.4,0-25-10.1-29-14.3c-2.3-2.3-4.1-2.1-4.1-2.1c-2.5,0.2-6.5,4-6.5,4\n\t\t\t\tc-12.5,12.6-26.4,12.3-26.6,12.3c-15.1-0.3-24.6-8.4-29.7-12.7c-1.1-0.9-1.9-1.6-2.6-2c-3.5-2.3-8.9-0.4-9-0.4\n\t\t\t\tc-0.2,0.1-0.5,0-0.6-0.3c-0.1-0.2,0-0.5,0.3-0.6c0.2-0.1,5.9-2.1,9.8,0.5c0.7,0.5,1.5,1.2,2.6,2.1c5,4.2,14.4,12.1,29.2,12.5\n\t\t\t\tc0.1,0,13.7,0.2,25.9-12c0.2-0.2,4.3-4,7-4.3c0.1,0,2.3-0.3,4.9,2.4c3.9,4,16.2,14,28.3,14c0.6,0,1.3,0,1.9-0.1\n\t\t\t\tc0.3-0.1,0.5,0.2,0.5,0.4c0,0.2-0.2,0.5-0.4,0.5C124.6,311.7,124,311.7,123.3,311.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M594.5,311.7c-0.6,0-1.3,0-1.9-0.1c-0.3,0-0.4-0.2-0.4-0.5c0-0.3,0.2-0.5,0.5-0.4\n\t\t\t\tc0.6,0.1,1.2,0.1,1.9,0.1c12.1,0,24.4-9.9,28.3-14c2.6-2.7,4.8-2.4,4.9-2.4c2.7,0.2,6.8,4.1,7,4.3c12.3,12.3,25.8,12,25.9,12.1\n\t\t\t\tc14.8-0.3,24.2-8.2,29.2-12.5c1.1-0.9,2-1.6,2.6-2.1c3.9-2.6,9.5-0.6,9.8-0.5c0.2,0.1,0.4,0.3,0.3,0.6c-0.1,0.2-0.4,0.4-0.6,0.3\n\t\t\t\tc-0.1,0-5.5-2-9,0.4c-0.6,0.4-1.5,1.1-2.6,2c-5.1,4.3-14.6,12.3-29.8,12.7c0,0,0,0-0.1,0c-1.3,0-14.5-0.3-26.5-12.3\n\t\t\t\tc0,0-4-3.8-6.5-4c-0.1,0-1.9-0.2-4.1,2.1C619.5,301.6,606.9,311.7,594.5,311.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M190.2,311.7c-12.4,0-25-10.1-29-14.3c-2.3-2.3-4.1-2.1-4.1-2.1c-2.5,0.2-6.5,4-6.5,4\n\t\t\t\tc-12.5,12.6-26.4,12.3-26.6,12.3c-0.3,0-0.4-0.2-0.4-0.5c0-0.2,0.2-0.4,0.5-0.4c0.1,0,13.6,0.3,25.9-12c0.2-0.2,4.3-4,7-4.3\n\t\t\t\tc0.1,0,2.3-0.3,4.9,2.4c3.9,4,16.3,14,28.3,14c0.6,0,1.3,0,1.9-0.1c0.3-0.1,0.5,0.2,0.5,0.4c0,0.2-0.2,0.5-0.4,0.5\n\t\t\t\tC191.5,311.7,190.9,311.7,190.2,311.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M256.8,311.7c-12.4,0-25-10.1-29-14.3c-2.3-2.3-4.1-2.1-4.1-2.1c-2.5,0.2-6.5,4-6.5,4\n\t\t\t\tc-12.5,12.6-26.4,12.3-26.6,12.3c-0.3,0-0.4-0.2-0.4-0.5c0-0.2,0.2-0.4,0.5-0.4c0.1,0,13.6,0.3,25.9-12c0.2-0.2,4.3-4,7-4.3\n\t\t\t\tc0.1,0,2.3-0.3,4.9,2.4c4.1,4.3,17.5,15,30.2,13.9c0.3-0.1,0.5,0.2,0.5,0.4c0,0.2-0.2,0.5-0.4,0.5\n\t\t\t\tC258.1,311.7,257.5,311.7,256.8,311.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M323.5,311.7c-12.4,0-25-10.1-29-14.3c-2.3-2.3-4.1-2.1-4.1-2.1c-2.5,0.2-6.5,4-6.5,4\n\t\t\t\tc-12.5,12.6-26.4,12.3-26.6,12.3c-0.3,0-0.4-0.2-0.4-0.5c0-0.2,0.3-0.4,0.5-0.4c0.1,0,13.6,0.3,25.9-12c0.2-0.2,4.3-4,7-4.3\n\t\t\t\tc0.1,0,2.3-0.3,4.9,2.4c3.9,4,16.2,14,28.3,14c0.6,0,1.3,0,1.9-0.1c0.3-0.1,0.5,0.2,0.5,0.4c0,0.2-0.2,0.5-0.4,0.5\n\t\t\t\tC324.8,311.7,324.1,311.7,323.5,311.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M390.1,311.7c-12.4,0-25-10.1-29-14.3c-2.3-2.3-4.1-2.1-4.1-2.1c-2.5,0.2-6.5,4-6.5,4\n\t\t\t\tc-12.5,12.6-26.4,12.3-26.6,12.3c-0.3,0-0.4-0.2-0.4-0.5c0-0.2,0.2-0.4,0.5-0.4c0.1,0,13.6,0.3,25.9-12c0.2-0.2,4.3-4,7-4.3\n\t\t\t\tc0.1,0,2.3-0.3,4.9,2.4c3.9,4,16.2,14,28.3,14c0.6,0,1.3,0,1.9-0.1c0.2-0.1,0.5,0.2,0.5,0.4c0,0.2-0.2,0.5-0.4,0.5\n\t\t\t\tC391.4,311.7,390.7,311.7,390.1,311.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M456.7,311.7c-12.4,0-25-10.1-29-14.3c-2.3-2.3-4.1-2.1-4.1-2.1c-2.5,0.2-6.5,4-6.5,4\n\t\t\t\tc-12.6,12.6-26.5,12.3-26.6,12.3c-0.2,0-0.4-0.2-0.4-0.5c0-0.2,0.2-0.4,0.5-0.4c0,0,0,0,0.1,0c1.2,0,14.1-0.3,25.8-12\n\t\t\t\tc0.2-0.2,4.3-4,7-4.3c0.1,0,2.3-0.3,4.9,2.4c3.9,4,16.3,14,28.3,14c0.6,0,1.2,0,1.9-0.1c0.3-0.1,0.5,0.2,0.5,0.4\n\t\t\t\tc0,0.2-0.2,0.5-0.4,0.5C458,311.7,457.3,311.7,456.7,311.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M523.3,311.7c-12.4,0-25-10.1-29-14.3c-2.2-2.3-4.1-2.1-4.1-2.1c-2.5,0.2-6.5,4-6.5,4\n\t\t\t\tc-12.6,12.6-26.5,12.3-26.6,12.3c-0.2,0-0.4-0.2-0.4-0.5c0-0.2,0.2-0.4,0.5-0.4c0,0,0,0,0.1,0c1.2,0,14.1-0.3,25.8-12\n\t\t\t\tc0.2-0.2,4.3-4,7-4.3c0.1,0,2.3-0.3,4.9,2.4c3.9,4,16.3,14,28.3,14c0.6,0,1.2,0,1.9-0.1c0.2-0.1,0.5,0.2,0.5,0.4\n\t\t\t\tc0,0.2-0.2,0.5-0.4,0.5C524.6,311.7,523.9,311.7,523.3,311.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M589.9,311.7c-12.4,0-25-10.1-29-14.3c-2.3-2.3-4.1-2.1-4.1-2.1c-2.5,0.2-6.5,4-6.5,4\n\t\t\t\tc-12.6,12.6-26.4,12.3-26.6,12.3c-0.2,0-0.4-0.2-0.4-0.5c0-0.2,0.2-0.5,0.5-0.4c0,0,0,0,0.1,0c1.2,0,14.1-0.3,25.8-12\n\t\t\t\tc0.2-0.2,4.3-4,7-4.3c0.1,0,2.3-0.3,4.9,2.4c3.9,4,16.3,14,28.3,14c0.6,0,1.2,0,1.9-0.1c0.2-0.1,0.5,0.2,0.5,0.4\n\t\t\t\tc0,0.2-0.2,0.5-0.4,0.5C591.2,311.7,590.6,311.7,589.9,311.7z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M716.2,126.7C716.2,126.7,716.2,126.7,716.2,126.7c-0.6,0-0.9-0.5-0.9-1c1-12.5-8.7-25.8-12.5-29.9\n\t\t\tc-2.6-2.7-2.3-5.1-2.3-5.2c0.2-2.8,3.6-6.8,4-7.2c11.1-12.1,10.8-25.5,10.8-25.6c-0.3-14.7-7.4-24-11.2-28.9\n\t\t\tc-0.8-1.1-1.5-2-1.9-2.7c-2.4-4.1-0.5-9.9-0.5-10.1c0.2-0.5,0.7-0.7,1.2-0.6c0.5,0.2,0.7,0.7,0.6,1.1c0,0.1-1.7,5.3,0.3,8.6\n\t\t\tc0.4,0.6,1,1.5,1.8,2.5c4,5.1,11.3,14.7,11.6,30c0,0.6,0.2,14.2-11.3,26.9c-0.9,1.1-3.4,4.3-3.5,6.2c0,0.1-0.1,1.7,1.8,3.8\n\t\t\tc0.1,0.2,14.3,15.4,13,31.3C717.1,126.3,716.7,126.7,716.2,126.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M716.2,194.7C716.2,194.7,716.2,194.7,716.2,194.7c-0.5,0-0.9-0.4-0.9-0.9c0-0.1,0.2-13.5-10.8-25.6\n\t\t\tc-0.4-0.5-3.8-4.5-4-7.3c0-0.1-0.3-2.4,2.3-5.2c3.8-4.1,13.5-17.4,12.5-29.9c0-0.5,0.3-0.9,0.8-1c0.5,0,0.9,0.3,1,0.8\n\t\t\tc1.3,15.8-12.9,31.1-13,31.3c-2,2.1-1.8,3.7-1.8,3.8c0.1,1.9,2.6,5.2,3.5,6.3c11.5,12.7,11.3,26.3,11.3,26.9\n\t\t\tC717.1,194.3,716.7,194.7,716.2,194.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M711.2,126.2C711.2,126.2,711.2,126.2,711.2,126.2c-0.3,0-0.5-0.2-0.5-0.5c1.1-12.6-9.7-26.1-13.9-30.2\n\t\t\tc-2.7-2.6-2.4-4.8-2.4-4.9c0.2-2.7,4.1-6.8,4.3-7c12.3-12.3,12.1-25.8,12.1-25.9c-0.3-14.8-8.2-24.2-12.5-29.2\n\t\t\tc-0.9-1.1-1.6-2-2.1-2.6c-2.6-3.9-0.5-9.5-0.5-9.8c0.1-0.2,0.3-0.4,0.6-0.3c0.2,0.1,0.4,0.3,0.3,0.6c0,0.1-2,5.5,0.4,9\n\t\t\tc0.4,0.6,1.1,1.5,2,2.6c4.3,5.1,12.3,14.6,12.7,29.8c0,0.1,0.3,14-12.3,26.6c0,0-3.8,4-4,6.5c0,0-0.2,1.9,2.1,4.1\n\t\t\tc4.3,4.2,15.3,17.9,14.2,30.9C711.7,126,711.5,126.2,711.2,126.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M702.5,302.7c-0.4,0-0.7-0.2-0.9-0.6c-0.1-0.2-2-6.1,0.5-10.1c0.4-0.7,1.1-1.6,1.9-2.7\n\t\t\tc3.8-5,10.9-14.3,11.2-28.9c0-0.1,0.2-13.5-10.8-25.6c-0.4-0.5-3.8-4.5-4-7.3c0,0-0.3-2.4,2.3-5.2c3.8-4.1,13.5-17.4,12.5-29.9\n\t\t\tc0-0.5,0.3-0.9,0.8-1c0.5-0.1,0.9,0.3,1,0.8c1.3,15.8-12.9,31.1-13,31.3c-2,2.1-1.8,3.7-1.8,3.8c0.1,1.9,2.6,5.2,3.5,6.3\n\t\t\tc11.5,12.7,11.3,26.3,11.3,26.9c-0.3,15.3-7.7,24.8-11.6,30c-0.8,1.1-1.5,1.9-1.8,2.5c-2,3.4-0.3,8.6-0.3,8.6\n\t\t\tc0.2,0.5-0.1,1-0.6,1.2C702.7,302.7,702.6,302.7,702.5,302.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M696.2,302.3c-0.2,0-0.4-0.1-0.4-0.3c-0.1-0.2-2.1-5.9,0.5-9.8c0.5-0.7,1.2-1.5,2.1-2.6\n\t\t\tc4.2-5,12.1-14.4,12.5-29.2c0-0.1,0.2-13.7-12-25.9c-0.2-0.2-4-4.3-4.3-7c0-0.1-0.3-2.3,2.4-4.9c4.3-4.1,15-17.6,13.9-30.2\n\t\t\tc0-0.2,0.2-0.5,0.4-0.5c0,0,0,0,0,0c0.2,0,0.4,0.2,0.5,0.4c1.2,13-9.8,26.7-14.2,30.9c-2.3,2.3-2.1,4.1-2.1,4.1\n\t\t\tc0.2,2.5,4,6.5,4,6.5c12.6,12.6,12.3,26.4,12.3,26.6c-0.3,15.1-8.4,24.6-12.7,29.7c-0.9,1.1-1.6,1.9-2,2.6c-2.3,3.5-0.4,8.9-0.4,9\n\t\t\tc0.1,0.2,0,0.5-0.3,0.6C696.3,302.3,696.2,302.3,696.2,302.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M711.2,195.1C711.2,195.1,711.2,195.1,711.2,195.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.1,0.2-13.6-12-25.9\n\t\t\tc-0.2-0.2-4-4.3-4.3-7c0-0.1-0.3-2.3,2.4-4.9c4.3-4.1,15-17.6,13.9-30.2c0-0.3,0.2-0.5,0.4-0.5c0,0,0,0,0,0c0.2,0,0.4,0.2,0.5,0.4\n\t\t\tc1.2,13-9.8,26.7-14.2,30.9c-2.3,2.3-2.1,4.1-2.1,4.1c0.2,2.5,4,6.5,4,6.5c12.6,12.6,12.3,26.4,12.3,26.6\n\t\t\tC711.7,194.9,711.5,195.1,711.2,195.1z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M2,126.7c-0.5,0-0.9-0.4-0.9-0.8c-1.3-15.9,12.9-31.1,13-31.3c2-2.1,1.8-3.7,1.8-3.8\n\t\t\tc-0.1-1.9-2.6-5.2-3.5-6.3C0.8,71.9,1.1,58.2,1.1,57.7c0.3-15.3,7.7-24.9,11.6-30c0.8-1.1,1.5-1.9,1.8-2.5c2-3.3,0.3-8.6,0.3-8.6\n\t\t\tc-0.2-0.5,0.1-1,0.6-1.1c0.5-0.2,1,0.1,1.1,0.6c0.1,0.2,2,6.1-0.5,10.1c-0.4,0.7-1.1,1.6-1.9,2.7C10.3,33.7,3.2,43,2.9,57.7\n\t\t\tc0,0.1-0.2,13.5,10.8,25.6c0.4,0.5,3.8,4.5,4,7.3c0,0,0.3,2.4-2.3,5.2c-3.8,4.1-13.5,17.4-12.5,29.9C2.9,126.2,2.6,126.6,2,126.7\n\t\t\tC2,126.7,2,126.7,2,126.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M2,194.7c-0.5,0-0.9-0.4-0.9-0.9c0-0.6-0.3-14.2,11.3-26.9c0.9-1.1,3.4-4.3,3.5-6.2c0-0.1,0.1-1.7-1.8-3.8\n\t\t\tc-0.1-0.2-14.3-15.4-13-31.3c0-0.5,0.5-0.8,1-0.8c0.5,0,0.9,0.5,0.8,1c-1,12.5,8.7,25.8,12.5,29.9c2.6,2.7,2.3,5.1,2.3,5.2\n\t\t\tc-0.2,2.8-3.6,6.8-4,7.2C2.7,180.2,2.9,193.6,2.9,193.7C2.9,194.2,2.5,194.7,2,194.7C2,194.7,2,194.7,2,194.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M7,126.2c-0.2,0-0.4-0.2-0.5-0.4c-1.2-13,9.8-26.7,14.2-30.9c2.3-2.3,2.1-4.1,2.1-4.1\n\t\t\tc-0.2-2.5-4-6.5-4-6.5C6.2,71.7,6.5,57.8,6.5,57.7C6.9,42.5,14.9,33,19.2,27.9c0.9-1.1,1.6-1.9,2-2.6c2.3-3.5,0.4-8.9,0.4-9\n\t\t\tc-0.1-0.2,0-0.5,0.3-0.6c0.2-0.1,0.5,0,0.6,0.3c0.1,0.2,2.1,5.9-0.5,9.8c-0.5,0.7-1.2,1.5-2.1,2.6c-4.2,5-12.1,14.4-12.5,29.2\n\t\t\tc0,0.1-0.3,13.7,12,25.9c0.2,0.2,4,4.3,4.3,7c0,0.1,0.3,2.3-2.4,4.9c-4.3,4.1-15,17.6-13.9,30.2C7.4,126,7.3,126.2,7,126.2\n\t\t\tC7,126.2,7,126.2,7,126.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M15.7,302.7c-0.1,0-0.2,0-0.3,0c-0.5-0.2-0.7-0.7-0.6-1.2c0-0.1,1.7-5.3-0.3-8.6c-0.4-0.6-1-1.5-1.8-2.5\n\t\t\tc-4-5.1-11.3-14.7-11.6-30c0-0.6-0.3-14.2,11.3-26.9c0.9-1.1,3.4-4.3,3.5-6.2c0-0.1,0.1-1.7-1.8-3.8c-0.1-0.2-14.3-15.4-13-31.3\n\t\t\tc0-0.5,0.5-0.9,1-0.8c0.5,0,0.9,0.5,0.8,1c-1,12.5,8.7,25.8,12.5,29.9c2.6,2.8,2.3,5.1,2.3,5.2c-0.2,2.8-3.6,6.8-4,7.2\n\t\t\tC2.7,246.8,2.9,260.2,2.9,260.3c0.3,14.7,7.4,24,11.2,28.9c0.8,1.1,1.5,2,1.9,2.7c2.4,4.1,0.5,9.9,0.5,10.1\n\t\t\tC16.4,302.5,16.1,302.7,15.7,302.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M22,302.3c-0.1,0-0.1,0-0.2,0c-0.2-0.1-0.4-0.3-0.3-0.6c0-0.1,2-5.5-0.4-9c-0.4-0.6-1.1-1.5-2-2.6\n\t\t\tc-4.3-5.1-12.3-14.6-12.7-29.8c0-0.1-0.3-14,12.3-26.6c0,0,3.8-4,4-6.5c0,0,0.2-1.9-2.1-4.1c-4.3-4.2-15.3-17.9-14.2-30.9\n\t\t\tc0-0.2,0.2-0.4,0.5-0.4c0,0,0,0,0,0c0.3,0,0.4,0.2,0.4,0.5c-1.1,12.6,9.7,26.1,13.9,30.2c2.7,2.6,2.4,4.8,2.4,4.9\n\t\t\tc-0.2,2.7-4.1,6.8-4.3,7C7.2,246.7,7.4,260.2,7.4,260.3c0.3,14.8,8.2,24.2,12.5,29.2c0.9,1.1,1.7,2,2.1,2.6\n\t\t\tc2.6,3.9,0.5,9.5,0.5,9.8C22.4,302.1,22.2,302.3,22,302.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M7,195.1c-0.2,0-0.4-0.2-0.5-0.4c0-0.1-0.3-14,12.3-26.6c0,0,3.8-4,4-6.5c0,0,0.2-1.9-2.1-4.1\n\t\t\tc-4.3-4.2-15.3-17.9-14.2-30.9c0-0.3,0.2-0.4,0.5-0.4c0.3,0,0.4,0.2,0.4,0.5c-1.1,12.6,9.7,26.1,13.9,30.2\n\t\t\tc2.7,2.6,2.4,4.8,2.4,4.9c-0.2,2.7-4.1,6.8-4.3,7C7.2,180.9,7.4,194.5,7.4,194.6C7.4,194.8,7.2,195.1,7,195.1\n\t\t\tC7,195.1,7,195.1,7,195.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M689.7,289.3H30.5c-0.3,0-0.5-0.2-0.5-0.5V29.6c0-0.3,0.2-0.5,0.5-0.5h659.2c0.3,0,0.5,0.2,0.5,0.5v259.3\n\t\tC690.2,289.1,690,289.3,689.7,289.3z M31,288.4h658.3V30H31V288.4z M663,264.4H57.3c-0.3,0-0.5-0.2-0.5-0.5V54.5\n\t\tc0-0.3,0.2-0.5,0.5-0.5H663c0.3,0,0.5,0.2,0.5,0.5v209.4C663.5,264.2,663.3,264.4,663,264.4z M57.7,263.4h604.8V55H57.7V263.4z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g></g>\n<g>\n<path d='M73.6,37.6c-2.7,0-4.2-0.2-9.4-1.9c-3.9-1.3-6.6-1.3-10.3-1.2l-1.6,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.6,0c3.6,0,6.5,0,10.6,1.3c5.9,1.9,6.8,1.9,10.6,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.7,0-2.3,0C74.5,37.6,74.1,37.6,73.6,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M56.1,37.5c-0.5,0-0.9,0-1.5,0c-0.7,0-1.4,0-2.3,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.7,0,2.3,0c3.8,0,4.7,0.1,10.6-1.9c4-1.3,6.9-1.3,10.6-1.3l1.6,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.6,0\n\t\t\t\tc-3.7,0-6.4,0-10.3,1.2C60.3,37.3,58.8,37.5,56.1,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M73.6,41.1c-2.7,0-4.2-0.2-9.4-1.9c-3.9-1.3-6.6-1.3-10.3-1.2l-1.6,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.6,0c3.6,0,6.5,0,10.6,1.3c5.9,1.9,6.8,1.9,10.6,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.7,0-2.3,0C74.5,41.1,74.1,41.1,73.6,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M56.1,41.1c-0.5,0-0.9,0-1.5,0c-0.7,0-1.4,0-2.3,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.7,0,2.3,0c3.8,0,4.7,0.1,10.6-1.9c4-1.3,6.9-1.3,10.6-1.3l1.6,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.6,0\n\t\t\t\tc-3.7,0-6.4,0-10.3,1.2C60.3,40.8,58.8,41.1,56.1,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M73.6,44.6c-2.7,0-4.2-0.2-9.4-1.9c-3.9-1.3-6.6-1.3-10.3-1.2l-1.6,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.6,0c3.7,0,6.5,0,10.6,1.3c5.9,1.9,6.8,1.9,10.6,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.7,0-2.3,0C74.5,44.6,74.1,44.6,73.6,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M56.1,44.6c-0.5,0-0.9,0-1.5,0c-0.7,0-1.4,0-2.3,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.7,0,2.3,0c3.8,0,4.7,0.1,10.6-1.9c4-1.3,6.9-1.3,10.6-1.3l1.6,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.6,0\n\t\t\t\tc-3.7,0-6.4,0-10.3,1.2C60.3,44.4,58.8,44.6,56.1,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M73.6,48.2c-2.7,0-4.2-0.2-9.4-1.9c-3.9-1.3-6.6-1.3-10.3-1.2l-1.6,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.6,0c3.7,0,6.5,0,10.6,1.3c5.9,1.9,6.8,1.9,10.6,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.7,0-2.3,0C74.5,48.2,74.1,48.2,73.6,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M56.1,48.1c-0.5,0-0.9,0-1.5,0c-0.7,0-1.4,0-2.3,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.7,0,2.3,0c3.8,0,4.7,0.1,10.6-1.9c4-1.3,6.9-1.3,10.6-1.3l1.6,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.6,0\n\t\t\t\tc-3.7,0-6.4,0-10.3,1.2C60.3,47.9,58.8,48.1,56.1,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M73.6,51.7c-2.7,0-4.2-0.2-9.4-1.9c-3.9-1.3-6.6-1.3-10.3-1.2l-1.6,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.6,0c3.6,0,6.5,0,10.6,1.3c5.9,1.9,6.8,1.9,10.6,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.7,0-2.3,0C74.5,51.7,74.1,51.7,73.6,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M56.1,51.6c-0.4,0-0.9,0-1.5,0c-0.7,0-1.4,0-2.3,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.7,0,2.3,0c3.8,0.1,4.7,0.1,10.6-1.9c4-1.3,6.9-1.3,10.6-1.3l1.6,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.6,0\n\t\t\t\tc-3.7,0-6.4,0-10.3,1.2C60.3,51.4,58.8,51.6,56.1,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M77.9,37.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0.1-0.2,0.1-0.3l3.1-2.9\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s-0.1,0.2-0.1,0.3L78.2,37C78.1,37.1,78,37.1,77.9,37.1z M75.6,33.8\n\t\t\t\t\tl2.3,2.2l2.4-2.3L78,31.6L75.6,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M77.8,42.8c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0.1-0.2,0.1-0.3l3.1-2.9\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s-0.1,0.2-0.1,0.3l-3.1,2.9C78.1,42.7,78,42.8,77.8,42.8z M75.5,39.5\n\t\t\t\t\tl2.3,2.2l2.4-2.3l-2.4-2.2L75.5,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M77.8,48.4c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0.1-0.2,0.1-0.3l3.1-2.9\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1-0.1,0.2-0.1,0.3l-3.1,2.9C78,48.3,77.9,48.4,77.8,48.4z M75.4,45.1\n\t\t\t\t\tl2.4,2.2l2.4-2.3l-2.3-2.2L75.4,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M77.9,53.9c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0.1-0.2,0.1-0.3l3.1-2.9\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s-0.1,0.2-0.1,0.3l-3.1,2.9C78.1,53.9,78,53.9,77.9,53.9z M75.6,50.7\n\t\t\t\t\tl2.3,2.2l2.4-2.3L78,48.4L75.6,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M99.5,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C100.4,37.6,99.9,37.6,99.5,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M82.8,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C86.8,37.3,85.4,37.5,82.8,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M99.5,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C100.4,41.1,99.9,41.1,99.5,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M82.8,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C86.8,40.8,85.4,41.1,82.8,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M99.5,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C100.4,44.6,99.9,44.6,99.5,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M82.8,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C86.8,44.4,85.4,44.6,82.8,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M99.5,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C100.4,48.2,99.9,48.2,99.5,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M82.8,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C86.8,47.9,85.4,48.1,82.8,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M99.5,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C100.4,51.7,99.9,51.7,99.5,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M82.7,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C86.8,51.4,85.4,51.6,82.7,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M103.6,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C103.8,37,103.7,37.1,103.6,37.1z M101.4,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L101.4,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M103.5,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C103.8,42.7,103.6,42.8,103.5,42.8z\n\t\t\t\t\t M101.3,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L101.3,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M103.5,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C103.7,48.3,103.6,48.4,103.5,48.4z\n\t\t\t\t\t M101.2,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L101.2,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M103.6,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C103.8,53.9,103.7,53.9,103.6,53.9z\n\t\t\t\t\t M101.4,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L101.4,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M125,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C125.9,37.6,125.5,37.6,125,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M108.3,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C112.3,37.3,110.9,37.5,108.3,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M125,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C125.9,41.1,125.5,41.1,125,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M108.3,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C112.3,40.8,110.9,41.1,108.3,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M125,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C125.9,44.6,125.5,44.6,125,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M108.3,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C112.3,44.4,110.9,44.6,108.3,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M125,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C125.9,48.2,125.5,48.2,125,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M108.3,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C112.3,47.9,110.9,48.1,108.3,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M125,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C125.9,51.7,125.5,51.7,125,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M108.3,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C112.3,51.4,110.9,51.6,108.3,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M129.2,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C129.4,37,129.3,37.1,129.2,37.1z M126.9,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L126.9,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M129.1,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C129.3,42.7,129.2,42.8,129.1,42.8z\n\t\t\t\t\t M126.9,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L126.9,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M129,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C129.2,48.3,129.1,48.4,129,48.4z\n\t\t\t\t\t M126.8,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L126.8,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M129.2,53.9c-0.1,0-0.2,0-0.3-0.1L126,51c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C129.4,53.9,129.3,53.9,129.2,53.9z\n\t\t\t\t\t M126.9,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L126.9,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M150.6,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C151.5,37.6,151,37.6,150.6,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M133.9,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C137.9,37.3,136.5,37.5,133.9,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M150.6,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C151.5,41.1,151,41.1,150.6,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M133.9,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C137.9,40.8,136.5,41.1,133.9,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M150.6,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C151.5,44.6,151,44.6,150.6,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M133.9,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C137.9,44.4,136.5,44.6,133.9,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M150.6,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C151.5,48.2,151,48.2,150.6,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M133.9,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C137.9,47.9,136.5,48.1,133.9,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M150.6,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C151.5,51.7,151,51.7,150.6,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M133.9,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C137.9,51.4,136.5,51.6,133.9,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M154.7,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C154.9,37,154.8,37.1,154.7,37.1z M152.5,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L152.5,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M154.6,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C154.9,42.7,154.8,42.8,154.6,42.8z\n\t\t\t\t\t M152.4,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L152.4,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M154.6,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C154.8,48.3,154.7,48.4,154.6,48.4z\n\t\t\t\t\t M152.3,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L152.3,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M154.7,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C154.9,53.9,154.8,53.9,154.7,53.9z\n\t\t\t\t\t M152.5,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L152.5,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M176.1,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C177,37.6,176.6,37.6,176.1,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M159.4,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C163.4,37.3,162,37.5,159.4,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M176.1,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C177,41.1,176.6,41.1,176.1,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M159.4,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C163.4,40.8,162,41.1,159.4,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M176.1,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C177,44.6,176.6,44.6,176.1,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M159.4,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C163.4,44.4,162,44.6,159.4,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M176.1,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C177,48.2,176.6,48.2,176.1,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M159.4,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C163.4,47.9,162,48.1,159.4,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M176.1,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C177,51.7,176.6,51.7,176.1,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M159.4,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C163.4,51.4,162,51.6,159.4,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M180.3,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C180.5,37,180.4,37.1,180.3,37.1z M178,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L178,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M180.2,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C180.4,42.7,180.3,42.8,180.2,42.8z\n\t\t\t\t\t M178,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L178,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M180.1,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C180.3,48.3,180.2,48.4,180.1,48.4z\n\t\t\t\t\t M177.9,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L177.9,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M180.3,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C180.5,53.9,180.4,53.9,180.3,53.9z\n\t\t\t\t\t M178,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L178,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M201.7,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C202.6,37.6,202.1,37.6,201.7,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M185,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C189,37.3,187.6,37.5,185,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M201.7,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C202.6,41.1,202.1,41.1,201.7,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M185,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C189,40.8,187.6,41.1,185,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M201.7,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C202.6,44.6,202.1,44.6,201.7,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M185,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C189,44.4,187.6,44.6,185,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M201.7,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C202.6,48.2,202.1,48.2,201.7,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M185,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C189,47.9,187.6,48.1,185,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M201.7,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C202.6,51.7,202.1,51.7,201.7,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M185,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C189,51.4,187.6,51.6,185,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M205.8,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C206.1,37,205.9,37.1,205.8,37.1z M203.6,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L203.6,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M205.7,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C206,42.7,205.9,42.8,205.7,42.8z\n\t\t\t\t\t M203.5,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L203.5,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M205.7,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C205.9,48.3,205.8,48.4,205.7,48.4z\n\t\t\t\t\t M203.4,45.1l2.2,2.2L208,45l-2.2-2.2L203.4,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M205.8,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C206.1,53.9,205.9,53.9,205.8,53.9z\n\t\t\t\t\t M203.6,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L203.6,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M227.2,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C228.1,37.6,227.7,37.6,227.2,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M210.5,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C214.5,37.3,213.1,37.5,210.5,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M227.2,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C228.1,41.1,227.7,41.1,227.2,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M210.5,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C214.5,40.8,213.1,41.1,210.5,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M227.2,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C228.1,44.6,227.7,44.6,227.2,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M210.5,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C214.5,44.4,213.1,44.6,210.5,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M227.2,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C228.1,48.2,227.7,48.2,227.2,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M210.5,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C214.6,47.9,213.1,48.1,210.5,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M227.2,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C228.1,51.7,227.7,51.7,227.2,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M210.5,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C214.5,51.4,213.1,51.6,210.5,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M231.4,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C231.6,37,231.5,37.1,231.4,37.1z M229.1,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L229.1,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M231.3,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C231.5,42.7,231.4,42.8,231.3,42.8z\n\t\t\t\t\t M229.1,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L229.1,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M231.2,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C231.5,48.3,231.3,48.4,231.2,48.4z\n\t\t\t\t\t M229,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L229,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M231.4,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C231.6,53.9,231.5,53.9,231.4,53.9z\n\t\t\t\t\t M229.1,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L229.1,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M252.8,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C253.7,37.6,253.2,37.6,252.8,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M236.1,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C240.1,37.3,238.7,37.5,236.1,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M252.8,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C253.7,41.1,253.2,41.1,252.8,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M236.1,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C240.1,40.8,238.7,41.1,236.1,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M252.8,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C253.7,44.6,253.2,44.6,252.8,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M236.1,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C240.1,44.4,238.7,44.6,236.1,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M252.8,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C253.7,48.2,253.2,48.2,252.8,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M236.1,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C240.1,47.9,238.7,48.1,236.1,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M252.8,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C253.7,51.7,253.2,51.7,252.8,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M236.1,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C240.1,51.4,238.7,51.6,236.1,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M256.9,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C257.2,37,257,37.1,256.9,37.1z M254.7,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L254.7,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M256.9,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C257.1,42.7,257,42.8,256.9,42.8z\n\t\t\t\t\t M254.6,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L254.6,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M256.8,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C257,48.3,256.9,48.4,256.8,48.4z\n\t\t\t\t\t M254.5,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L254.5,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M256.9,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C257.2,53.9,257,53.9,256.9,53.9z\n\t\t\t\t\t M254.7,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L254.7,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M278.3,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C279.2,37.6,278.8,37.6,278.3,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M261.6,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C265.7,37.3,264.2,37.5,261.6,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M278.3,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C279.2,41.1,278.8,41.1,278.3,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M261.6,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C265.7,40.8,264.2,41.1,261.6,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M278.3,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C279.2,44.6,278.8,44.6,278.3,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M261.6,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C265.7,44.4,264.2,44.6,261.6,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M278.4,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C279.2,48.2,278.8,48.2,278.4,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M261.6,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C265.7,47.9,264.2,48.1,261.6,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M278.3,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C279.2,51.7,278.8,51.7,278.3,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M261.6,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C265.7,51.4,264.2,51.6,261.6,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M282.5,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C282.7,37,282.6,37.1,282.5,37.1z M280.2,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L280.2,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M282.4,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C282.6,42.7,282.5,42.8,282.4,42.8z\n\t\t\t\t\t M280.2,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L280.2,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M282.3,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C282.6,48.3,282.4,48.4,282.3,48.4z\n\t\t\t\t\t M280.1,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L280.1,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M282.5,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C282.7,53.9,282.6,53.9,282.5,53.9z\n\t\t\t\t\t M280.2,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L280.2,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M303.9,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C304.8,37.6,304.3,37.6,303.9,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M287.2,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C291.2,37.3,289.8,37.5,287.2,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M303.9,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C304.8,41.1,304.3,41.1,303.9,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M287.2,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C291.2,40.8,289.8,41.1,287.2,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M303.9,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C304.8,44.6,304.3,44.6,303.9,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M287.2,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C291.2,44.4,289.8,44.6,287.2,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M303.9,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C304.8,48.2,304.3,48.2,303.9,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M287.2,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C291.2,47.9,289.8,48.1,287.2,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M303.9,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C304.8,51.7,304.3,51.7,303.9,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M287.2,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C291.2,51.4,289.8,51.6,287.2,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M308,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C308.3,37,308.1,37.1,308,37.1z M305.8,33.8\n\t\t\t\t\tL308,36l2.3-2.2l-2.2-2.2L305.8,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M308,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C308.2,42.7,308.1,42.8,308,42.8z\n\t\t\t\t\t M305.7,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L305.7,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M307.9,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C308.1,48.3,308,48.4,307.9,48.4z\n\t\t\t\t\t M305.6,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L305.6,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M308,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C308.3,53.9,308.1,53.9,308,53.9z\n\t\t\t\t\t M305.8,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L305.8,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M329.4,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C330.3,37.6,329.9,37.6,329.4,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M312.7,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C316.8,37.3,315.3,37.5,312.7,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M329.4,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C330.3,41.1,329.9,41.1,329.4,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M312.7,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C316.8,40.8,315.3,41.1,312.7,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M329.4,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C330.3,44.6,329.9,44.6,329.4,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M312.7,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C316.8,44.4,315.3,44.6,312.7,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M329.5,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C330.4,48.2,329.9,48.2,329.5,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M312.7,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C316.8,47.9,315.3,48.1,312.7,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M329.4,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C330.3,51.7,329.9,51.7,329.4,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M312.7,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C316.8,51.4,315.3,51.6,312.7,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M333.6,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C333.8,37,333.7,37.1,333.6,37.1z M331.3,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L331.3,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M333.5,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C333.7,42.7,333.6,42.8,333.5,42.8z\n\t\t\t\t\t M331.3,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L331.3,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M333.4,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C333.7,48.3,333.5,48.4,333.4,48.4z\n\t\t\t\t\t M331.2,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L331.2,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M333.6,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C333.8,53.9,333.7,53.9,333.6,53.9z\n\t\t\t\t\t M331.3,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L331.3,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M355,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C355.9,37.6,355.4,37.6,355,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M338.3,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C342.3,37.3,340.9,37.5,338.3,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M355,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C355.9,41.1,355.4,41.1,355,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M338.3,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C342.3,40.8,340.9,41.1,338.3,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M355,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C355.9,44.6,355.4,44.6,355,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M338.3,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C342.3,44.4,340.9,44.6,338.3,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M355,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C355.9,48.2,355.4,48.2,355,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M338.3,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C342.3,47.9,340.9,48.1,338.3,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M355,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C355.9,51.7,355.4,51.7,355,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M338.3,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C342.3,51.4,340.9,51.6,338.3,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M359.1,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C359.4,37,359.3,37.1,359.1,37.1z M356.9,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L356.9,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M359.1,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C359.3,42.7,359.2,42.8,359.1,42.8z\n\t\t\t\t\t M356.8,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L356.8,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M359,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C359.2,48.3,359.1,48.4,359,48.4z\n\t\t\t\t\t M356.8,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L356.8,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M359.1,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C359.4,53.9,359.3,53.9,359.1,53.9z\n\t\t\t\t\t M356.9,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L356.9,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M380.6,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C381.5,37.6,381,37.6,380.6,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M363.8,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C367.9,37.3,366.4,37.5,363.8,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M380.6,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C381.5,41.1,381,41.1,380.6,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M363.8,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C367.9,40.8,366.4,41.1,363.8,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M380.6,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C381.4,44.6,381,44.6,380.6,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M363.8,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C367.9,44.4,366.4,44.6,363.8,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M380.6,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C381.5,48.2,381,48.2,380.6,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M363.8,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C367.9,47.9,366.4,48.1,363.8,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M380.6,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C381.5,51.7,381,51.7,380.6,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M363.8,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C367.9,51.4,366.4,51.6,363.8,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M384.7,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C384.9,37,384.8,37.1,384.7,37.1z M382.5,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L382.5,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M384.6,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C384.8,42.7,384.7,42.8,384.6,42.8z\n\t\t\t\t\t M382.4,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L382.4,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M384.5,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C384.8,48.3,384.7,48.4,384.5,48.4z\n\t\t\t\t\t M382.3,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L382.3,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M384.7,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C384.9,53.9,384.8,53.9,384.7,53.9z\n\t\t\t\t\t M382.5,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L382.5,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M406.1,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C407,37.6,406.5,37.6,406.1,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M389.4,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C393.4,37.3,392,37.5,389.4,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M406.1,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C407,41.1,406.5,41.1,406.1,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M389.4,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C393.4,40.8,392,41.1,389.4,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M406.1,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.6,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C407,44.6,406.5,44.6,406.1,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M389.4,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C393.4,44.4,392,44.6,389.4,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M406.1,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C407,48.2,406.5,48.2,406.1,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M389.4,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C393.4,47.9,392,48.1,389.4,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M406.1,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C407,51.7,406.5,51.7,406.1,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M389.4,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C393.4,51.4,392,51.6,389.4,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M410.2,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C410.5,37,410.4,37.1,410.2,37.1z M408,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L408,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M410.2,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C410.4,42.7,410.3,42.8,410.2,42.8z\n\t\t\t\t\t M407.9,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L407.9,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M410.1,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C410.3,48.3,410.2,48.4,410.1,48.4z\n\t\t\t\t\t M407.9,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L407.9,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M410.2,53.9c-0.1,0-0.2,0-0.3-0.1L407,51c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C410.5,53.9,410.4,53.9,410.2,53.9z\n\t\t\t\t\t M408,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L408,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M431.7,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C432.6,37.6,432.1,37.6,431.7,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M414.9,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C419,37.3,417.5,37.5,414.9,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M431.7,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C432.6,41.1,432.1,41.1,431.7,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M414.9,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C419,40.8,417.5,41.1,414.9,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M431.7,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C432.6,44.6,432.1,44.6,431.7,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M414.9,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C419,44.4,417.5,44.6,414.9,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M431.7,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C432.6,48.2,432.1,48.2,431.7,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M414.9,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C419,47.9,417.5,48.1,414.9,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M431.7,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C432.6,51.7,432.1,51.7,431.7,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M414.9,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C419,51.4,417.5,51.6,414.9,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M435.8,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C436,37,435.9,37.1,435.8,37.1z M433.6,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L433.6,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M435.7,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C436,42.7,435.8,42.8,435.7,42.8z\n\t\t\t\t\t M433.5,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L433.5,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M435.6,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C435.9,48.3,435.8,48.4,435.6,48.4z\n\t\t\t\t\t M433.4,45.1l2.2,2.2L438,45l-2.2-2.2L433.4,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M435.8,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C436,53.9,435.9,53.9,435.8,53.9z\n\t\t\t\t\t M433.6,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L433.6,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M457.2,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C458.1,37.6,457.6,37.6,457.2,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M440.5,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C444.5,37.3,443.1,37.5,440.5,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M457.2,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C458.1,41.1,457.6,41.1,457.2,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M440.5,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C444.5,40.8,443.1,41.1,440.5,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M457.2,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C458.1,44.6,457.6,44.6,457.2,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M440.5,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C444.5,44.4,443.1,44.6,440.5,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M457.2,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C458.1,48.2,457.7,48.2,457.2,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M440.5,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C444.5,47.9,443.1,48.1,440.5,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M457.2,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C458.1,51.7,457.6,51.7,457.2,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M440.5,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C444.5,51.4,443.1,51.6,440.5,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M461.3,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C461.6,37,461.5,37.1,461.3,37.1z M459.1,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L459.1,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M461.3,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C461.5,42.7,461.4,42.8,461.3,42.8z\n\t\t\t\t\t M459,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L459,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M461.2,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C461.4,48.3,461.3,48.4,461.2,48.4z\n\t\t\t\t\t M459,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L459,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M461.3,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C461.6,53.9,461.5,53.9,461.3,53.9z\n\t\t\t\t\t M459.1,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L459.1,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M482.8,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C483.7,37.6,483.2,37.6,482.8,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M466,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C470.1,37.3,468.7,37.5,466,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M482.8,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C483.7,41.1,483.2,41.1,482.8,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M466,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C470.1,40.8,468.7,41.1,466,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M482.8,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C483.7,44.6,483.2,44.6,482.8,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M466,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C470.1,44.4,468.7,44.6,466,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M482.8,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C483.7,48.2,483.2,48.2,482.8,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M466.1,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C470.1,47.9,468.7,48.1,466.1,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M482.8,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C483.7,51.7,483.2,51.7,482.8,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M466,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C470.1,51.4,468.6,51.6,466,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M486.9,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C487.1,37,487,37.1,486.9,37.1z M484.7,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L484.7,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M486.8,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C487.1,42.7,486.9,42.8,486.8,42.8z\n\t\t\t\t\t M484.6,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L484.6,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M486.8,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C487,48.3,486.9,48.4,486.8,48.4z\n\t\t\t\t\t M484.5,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L484.5,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M486.9,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C487.1,53.9,487,53.9,486.9,53.9z\n\t\t\t\t\t M484.7,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L484.7,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M508.3,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C509.2,37.6,508.8,37.6,508.3,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M491.6,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C495.6,37.3,494.2,37.5,491.6,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M508.3,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C509.2,41.1,508.8,41.1,508.3,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M491.6,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C495.6,40.8,494.2,41.1,491.6,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M508.3,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C509.2,44.6,508.8,44.6,508.3,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M491.6,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C495.6,44.4,494.2,44.6,491.6,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M508.3,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C509.2,48.2,508.8,48.2,508.3,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M491.6,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C495.6,47.9,494.2,48.1,491.6,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M508.3,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C509.2,51.7,508.8,51.7,508.3,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M491.6,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C495.6,51.4,494.2,51.6,491.6,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M512.5,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C512.7,37,512.6,37.1,512.5,37.1z M510.2,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L510.2,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M512.4,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C512.6,42.7,512.5,42.8,512.4,42.8z\n\t\t\t\t\t M510.1,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L510.1,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M512.3,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C512.5,48.3,512.4,48.4,512.3,48.4z\n\t\t\t\t\t M510.1,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L510.1,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M512.5,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C512.7,53.9,512.6,53.9,512.5,53.9z\n\t\t\t\t\t M510.2,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L510.2,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M533.9,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C534.8,37.6,534.3,37.6,533.9,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M517.2,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C521.2,37.3,519.8,37.5,517.2,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M533.9,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C534.8,41.1,534.3,41.1,533.9,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M517.2,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C521.2,40.8,519.8,41.1,517.2,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M533.9,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C534.8,44.6,534.3,44.6,533.9,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M517.2,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C521.2,44.4,519.8,44.6,517.2,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M533.9,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C534.8,48.2,534.3,48.2,533.9,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M517.2,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C521.2,47.9,519.8,48.1,517.2,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M533.9,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C534.8,51.7,534.3,51.7,533.9,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M517.1,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C521.2,51.4,519.7,51.6,517.1,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M538,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C538.2,37,538.1,37.1,538,37.1z M535.8,33.8\n\t\t\t\t\tL538,36l2.3-2.2l-2.2-2.2L535.8,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M537.9,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C538.2,42.7,538,42.8,537.9,42.8z\n\t\t\t\t\t M535.7,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L535.7,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M537.9,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C538.1,48.3,538,48.4,537.9,48.4z\n\t\t\t\t\t M535.6,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L535.6,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M538,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C538.2,53.9,538.1,53.9,538,53.9z\n\t\t\t\t\t M535.8,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L535.8,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M559.4,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C560.3,37.6,559.9,37.6,559.4,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M542.7,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C546.7,37.3,545.3,37.5,542.7,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M559.4,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C560.3,41.1,559.9,41.1,559.4,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M542.7,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C546.7,40.8,545.3,41.1,542.7,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M559.4,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C560.3,44.6,559.9,44.6,559.4,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M542.7,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C546.7,44.4,545.3,44.6,542.7,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M559.4,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C560.3,48.2,559.9,48.2,559.4,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M542.7,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C546.7,47.9,545.3,48.1,542.7,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M559.4,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C560.3,51.7,559.9,51.7,559.4,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M542.7,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C546.7,51.4,545.3,51.6,542.7,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M563.6,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C563.8,37,563.7,37.1,563.6,37.1z M561.3,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L561.3,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M563.5,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C563.7,42.7,563.6,42.8,563.5,42.8z\n\t\t\t\t\t M561.3,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L561.3,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M563.4,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C563.6,48.3,563.5,48.4,563.4,48.4z\n\t\t\t\t\t M561.2,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L561.2,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M563.6,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C563.8,53.9,563.7,53.9,563.6,53.9z\n\t\t\t\t\t M561.3,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L561.3,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M585,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C585.9,37.6,585.4,37.6,585,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M568.3,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C572.3,37.3,570.9,37.5,568.3,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M585,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C585.9,41.1,585.4,41.1,585,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M568.3,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C572.3,40.8,570.9,41.1,568.3,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M585,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C585.9,44.6,585.4,44.6,585,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M568.3,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C572.3,44.4,570.9,44.6,568.3,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M585,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C585.9,48.2,585.4,48.2,585,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M568.3,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C572.3,47.9,570.9,48.1,568.3,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M585,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C585.9,51.7,585.4,51.7,585,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M568.3,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C572.3,51.4,570.9,51.6,568.3,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M589.1,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C589.3,37,589.2,37.1,589.1,37.1z M586.9,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L586.9,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M589,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C589.3,42.7,589.2,42.8,589,42.8z\n\t\t\t\t\t M586.8,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L586.8,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M589,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C589.2,48.3,589.1,48.4,589,48.4z\n\t\t\t\t\t M586.7,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L586.7,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M589.1,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C589.3,53.9,589.2,53.9,589.1,53.9z\n\t\t\t\t\t M586.9,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L586.9,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M610.5,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C611.4,37.6,611,37.6,610.5,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M593.8,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C597.8,37.3,596.4,37.5,593.8,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M610.5,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C611.4,41.1,611,41.1,610.5,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M593.8,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C597.8,40.8,596.4,41.1,593.8,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M610.5,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C611.4,44.6,611,44.6,610.5,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M593.8,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C597.8,44.4,596.4,44.6,593.8,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M610.5,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C611.4,48.2,611,48.2,610.5,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M593.8,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C597.8,47.9,596.4,48.1,593.8,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M610.5,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C611.4,51.7,611,51.7,610.5,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M593.8,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C597.8,51.4,596.4,51.6,593.8,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M614.7,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C614.9,37,614.8,37.1,614.7,37.1z M612.4,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L612.4,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M614.6,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C614.8,42.7,614.7,42.8,614.6,42.8z\n\t\t\t\t\t M612.4,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L612.4,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M614.5,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C614.7,48.3,614.6,48.4,614.5,48.4z\n\t\t\t\t\t M612.3,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L612.3,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M614.7,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C614.9,53.9,614.8,53.9,614.7,53.9z\n\t\t\t\t\t M612.4,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L612.4,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M636.1,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C637,37.6,636.5,37.6,636.1,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M619.4,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C623.4,37.3,622,37.5,619.4,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M636.1,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C637,41.1,636.5,41.1,636.1,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M619.4,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C623.4,40.8,622,41.1,619.4,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M636.1,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C637,44.6,636.5,44.6,636.1,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M619.4,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C623.4,44.4,622,44.6,619.4,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M636.1,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C637,48.2,636.5,48.2,636.1,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M619.4,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C623.4,47.9,622,48.1,619.4,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M636.1,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C637,51.7,636.5,51.7,636.1,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M619.4,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C623.4,51.4,622,51.6,619.4,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M640.2,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C640.4,37,640.3,37.1,640.2,37.1z M638,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L638,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M640.1,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C640.4,42.7,640.3,42.8,640.1,42.8z\n\t\t\t\t\t M637.9,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L637.9,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M640.1,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C640.3,48.3,640.2,48.4,640.1,48.4z\n\t\t\t\t\t M637.8,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L637.8,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M640.2,53.9c-0.1,0-0.2,0-0.3-0.1L637,51c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C640.4,53.9,640.3,53.9,640.2,53.9z\n\t\t\t\t\t M638,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L638,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M661.6,37.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C662.5,37.6,662.1,37.6,661.6,37.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M644.9,37.5c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C649,37.3,647.5,37.5,644.9,37.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M661.6,41.1c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C662.5,41.1,662.1,41.1,661.6,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M644.9,41.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C649,40.8,647.5,41.1,644.9,41.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M661.6,44.6c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C662.5,44.6,662.1,44.6,661.6,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M644.9,44.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C649,44.4,647.5,44.6,644.9,44.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M661.6,48.2c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C662.5,48.2,662.1,48.2,661.6,48.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M644.9,48.1c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C649,47.9,647.5,48.1,644.9,48.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M661.6,51.7c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C662.5,51.7,662.1,51.7,661.6,51.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M644.9,51.6c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C648.9,51.4,647.5,51.6,644.9,51.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M665.8,37.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C666,37,665.9,37.1,665.8,37.1z M663.5,33.8\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L663.5,33.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M665.7,42.8c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C665.9,42.7,665.8,42.8,665.7,42.8z\n\t\t\t\t\t M663.5,39.5l2.2,2.2l2.3-2.2l-2.2-2.2L663.5,39.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M665.6,48.4c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C665.9,48.3,665.7,48.4,665.6,48.4z\n\t\t\t\t\t M663.4,45.1l2.2,2.2l2.3-2.2l-2.2-2.2L663.4,45.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M665.8,53.9c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C666,53.9,665.9,53.9,665.8,53.9z\n\t\t\t\t\t M663.5,50.7l2.2,2.2l2.3-2.2l-2.2-2.2L663.5,50.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M681.9,56.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC682.4,55.9,682.2,56.1,681.9,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M685.2,56.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC685.7,55.9,685.5,56.1,685.2,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M678.3,56.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC678.7,55.9,678.5,56.1,678.3,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M681.6,56.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC682,55.9,681.8,56.1,681.6,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.7,56.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC675.1,55.9,674.9,56.1,674.7,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M677.9,56.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC678.4,55.9,678.2,56.1,677.9,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M671,56.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3l0-1.4\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC671.5,55.9,671.3,56.1,671,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.3,56.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC674.8,55.9,674.6,56.1,674.3,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M667.4,56.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.3,0,5.9-1.3,9.6c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC667.9,55.9,667.7,56.1,667.4,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M670.7,56.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.6l0,1.5\n\t\t\t\tC671.1,55.9,670.9,56.1,670.7,56.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M685.4,59.4c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C685.6,59.4,685.5,59.4,685.4,59.4z M683.1,56.1\n\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L683.1,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M679.5,59.3c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C679.8,59.3,679.6,59.3,679.5,59.3z\n\t\t\t\t\t M677.2,56.1l2.3,2.2l2.2-2.1l-2.3-2.2L677.2,56.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M673.8,59.3c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C674,59.2,673.9,59.3,673.8,59.3z M671.5,56\n\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L671.5,56z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M668.1,59.4c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C668.3,59.4,668.2,59.4,668.1,59.4z M665.8,56.1\n\t\t\t\t\tl2.3,2.2l2.2-2.1L668,54L665.8,56.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M681.9,80.4c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC682.4,80.2,682.2,80.4,681.9,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M685.2,80.4c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC685.7,80.2,685.5,80.4,685.2,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M678.3,80.4c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC678.7,80.2,678.5,80.4,678.3,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M681.6,80.4c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC682,80.2,681.8,80.4,681.6,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.7,80.4c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC675.1,80.2,674.9,80.4,674.7,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M677.9,80.4c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC678.4,80.2,678.2,80.4,677.9,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M671,80.4c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3l0-1.4\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC671.5,80.2,671.3,80.4,671,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.3,80.4c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC674.8,80.2,674.6,80.4,674.3,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M667.4,80.4c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.3,0,5.9-1.3,9.6c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC667.9,80.2,667.7,80.4,667.4,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M670.7,80.4c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.6l0,1.5\n\t\t\t\tC671.1,80.2,670.9,80.4,670.7,80.4z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M685.4,83.7c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C685.6,83.7,685.5,83.7,685.4,83.7z\n\t\t\t\t\t M683.1,80.4l2.3,2.2l2.2-2.1l-2.3-2.2L683.1,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M679.5,83.6c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C679.8,83.6,679.6,83.6,679.5,83.6z M677.2,80.4\n\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L677.2,80.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M673.8,83.6c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C674,83.5,673.9,83.6,673.8,83.6z\n\t\t\t\t\t M671.5,80.3l2.3,2.2l2.2-2.1l-2.3-2.2L671.5,80.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M668.1,83.7c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C668.3,83.7,668.2,83.7,668.1,83.7z\n\t\t\t\t\t M665.8,80.4l2.3,2.2l2.2-2.1l-2.3-2.2L665.8,80.4z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M681.9,106.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC682.4,106.5,682.2,106.7,681.9,106.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M685.2,106.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC685.7,106.5,685.5,106.7,685.2,106.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M678.3,106.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC678.7,106.5,678.5,106.7,678.3,106.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M681.6,106.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC682,106.5,681.8,106.7,681.6,106.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.7,106.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC675.1,106.5,674.9,106.7,674.7,106.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M677.9,106.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC678.4,106.5,678.2,106.7,677.9,106.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M671,106.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC671.5,106.5,671.3,106.7,671,106.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.3,106.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC674.8,106.5,674.6,106.7,674.3,106.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M667.4,106.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.3,0,5.9-1.3,9.6c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC667.9,106.5,667.7,106.7,667.4,106.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M670.7,106.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.6l0,1.5\n\t\t\t\tC671.1,106.5,670.9,106.7,670.7,106.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M685.4,110c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C685.6,109.9,685.5,110,685.4,110z\n\t\t\t\t\t M683.1,106.7l2.3,2.2l2.2-2.1l-2.3-2.2L683.1,106.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M679.5,109.9c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C679.8,109.9,679.6,109.9,679.5,109.9z\n\t\t\t\t\t M677.2,106.6l2.3,2.2l2.2-2.1l-2.3-2.2L677.2,106.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M673.8,109.8c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C674,109.8,673.9,109.8,673.8,109.8z\n\t\t\t\t\t M671.5,106.6l2.3,2.2l2.2-2.1l-2.3-2.2L671.5,106.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M668.1,110c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C668.3,109.9,668.2,110,668.1,110z\n\t\t\t\t\t M665.8,106.7l2.3,2.2l2.2-2.1l-2.3-2.2L665.8,106.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M681.9,131c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC682.4,130.8,682.2,131,681.9,131z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M685.2,131c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC685.7,130.8,685.5,131,685.2,131z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M678.3,131c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC678.7,130.8,678.5,131,678.3,131z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M681.6,131c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC682,130.8,681.8,131,681.6,131z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.7,131c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC675.1,130.8,674.9,131,674.7,131z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M677.9,131c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC678.4,130.8,678.2,131,677.9,131z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M671,131c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3l0-1.4\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC671.5,130.8,671.3,131,671,131z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.3,131c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC674.8,130.8,674.6,131,674.3,131z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M667.4,131c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.3,0,5.9-1.3,9.6c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC667.9,130.8,667.7,131,667.4,131z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M670.7,131c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.6l0,1.5\n\t\t\t\tC671.1,130.8,670.9,131,670.7,131z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M685.4,134.3c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C685.6,134.2,685.5,134.3,685.4,134.3z M683.1,131\n\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L683.1,131z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M679.5,134.2c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C679.8,134.1,679.6,134.2,679.5,134.2z\n\t\t\t\t\t M677.2,130.9l2.3,2.2l2.2-2.1l-2.3-2.2L677.2,130.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M673.8,134.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C674,134.1,673.9,134.1,673.8,134.1z\n\t\t\t\t\t M671.5,130.8l2.3,2.2l2.2-2.1l-2.3-2.2L671.5,130.8z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M668.1,134.3c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C668.3,134.2,668.2,134.3,668.1,134.3z M665.8,131\n\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L665.8,131z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M681.9,157.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC682.4,157,682.2,157.2,681.9,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M685.2,157.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC685.7,157,685.5,157.2,685.2,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M678.3,157.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC678.7,157,678.5,157.2,678.3,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M681.6,157.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC682,157,681.8,157.2,681.6,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.7,157.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC675.1,157,674.9,157.2,674.7,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M677.9,157.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC678.4,157,678.2,157.2,677.9,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M671,157.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC671.5,157,671.3,157.2,671,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.3,157.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC674.8,157,674.6,157.2,674.3,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M667.4,157.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.3,0,5.9-1.3,9.6c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC667.9,157,667.7,157.2,667.4,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M670.7,157.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.6l0,1.5\n\t\t\t\tC671.1,157,670.9,157.2,670.7,157.2z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M685.4,160.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C685.6,160.5,685.5,160.5,685.4,160.5z\n\t\t\t\t\t M683.1,157.3l2.3,2.2l2.2-2.1l-2.3-2.2L683.1,157.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M679.5,160.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C679.8,160.4,679.6,160.5,679.5,160.5z\n\t\t\t\t\t M677.2,157.2l2.3,2.2l2.2-2.1l-2.3-2.2L677.2,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M673.8,160.4c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C674,160.3,673.9,160.4,673.8,160.4z\n\t\t\t\t\t M671.5,157.1l2.3,2.2l2.2-2.1l-2.3-2.2L671.5,157.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M668.1,160.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C668.3,160.5,668.2,160.5,668.1,160.5z\n\t\t\t\t\t M665.8,157.3l2.3,2.2l2.2-2.1l-2.3-2.2L665.8,157.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M681.9,181.5c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC682.4,181.3,682.2,181.5,681.9,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M685.2,181.5c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC685.7,181.3,685.5,181.5,685.2,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M678.3,181.5c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC678.7,181.3,678.5,181.5,678.3,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M681.6,181.5c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC682,181.3,681.8,181.5,681.6,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.7,181.5c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC675.1,181.3,674.9,181.5,674.7,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M677.9,181.5c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC678.4,181.3,678.2,181.5,677.9,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M671,181.5c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC671.5,181.3,671.3,181.5,671,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.3,181.5c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC674.8,181.3,674.6,181.5,674.3,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M667.4,181.5c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.3,0,6-1.3,9.6c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC667.9,181.3,667.7,181.5,667.4,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M670.7,181.5c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.6l0,1.5\n\t\t\t\tC671.1,181.3,670.9,181.5,670.7,181.5z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M685.4,184.8c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C685.6,184.8,685.5,184.8,685.4,184.8z\n\t\t\t\t\t M683.1,181.5l2.3,2.2l2.2-2.1l-2.3-2.2L683.1,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M679.5,184.7c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C679.8,184.7,679.6,184.7,679.5,184.7z\n\t\t\t\t\t M677.2,181.5l2.3,2.2l2.2-2.1l-2.3-2.2L677.2,181.5z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M673.8,184.7c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C674,184.6,673.9,184.7,673.8,184.7z M671.5,181.4\n\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L671.5,181.4z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M668.1,184.8c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C668.3,184.8,668.2,184.8,668.1,184.8z\n\t\t\t\t\t M665.8,181.5l2.3,2.2l2.2-2.1l-2.3-2.2L665.8,181.5z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M681.9,207.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC682.4,207.6,682.2,207.8,681.9,207.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M685.2,207.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC685.7,207.6,685.5,207.8,685.2,207.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M678.3,207.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC678.7,207.6,678.5,207.8,678.3,207.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M681.6,207.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC682,207.6,681.8,207.8,681.6,207.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.7,207.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC675.1,207.6,674.9,207.8,674.7,207.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M677.9,207.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC678.4,207.6,678.2,207.8,677.9,207.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M671,207.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC671.5,207.6,671.3,207.8,671,207.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.3,207.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC674.8,207.6,674.6,207.8,674.3,207.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M667.4,207.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.3,0,5.9-1.3,9.6c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC667.9,207.6,667.7,207.8,667.4,207.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M670.7,207.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.6l0,1.5\n\t\t\t\tC671.1,207.6,670.9,207.8,670.7,207.8z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M685.4,211.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C685.6,211,685.5,211.1,685.4,211.1z M683.1,207.8\n\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L683.1,207.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M679.5,211c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C679.8,211,679.6,211,679.5,211z M677.2,207.7\n\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L677.2,207.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M673.8,210.9c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C674,210.9,673.9,210.9,673.8,210.9z\n\t\t\t\t\t M671.5,207.7l2.3,2.2l2.2-2.1l-2.3-2.2L671.5,207.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M668.1,211.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C668.3,211,668.2,211.1,668.1,211.1z M665.8,207.8\n\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L665.8,207.8z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M681.9,232.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC682.4,231.9,682.2,232.1,681.9,232.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M685.2,232.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC685.7,231.9,685.5,232.1,685.2,232.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M678.3,232.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC678.7,231.9,678.5,232.1,678.3,232.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M681.6,232.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC682,231.9,681.8,232.1,681.6,232.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.7,232.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC675.1,231.9,674.9,232.1,674.7,232.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M677.9,232.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC678.4,231.9,678.2,232.1,677.9,232.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M671,232.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC671.5,231.9,671.3,232.1,671,232.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.3,232.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC674.8,231.9,674.6,232.1,674.3,232.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M667.4,232.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.3,0,5.9-1.3,9.6c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC667.9,231.9,667.7,232.1,667.4,232.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M670.7,232.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.6l0,1.5\n\t\t\t\tC671.1,231.9,670.9,232.1,670.7,232.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M685.4,235.4c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C685.6,235.3,685.5,235.4,685.4,235.4z\n\t\t\t\t\t M683.1,232.1l2.3,2.2l2.2-2.1l-2.3-2.2L683.1,232.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M679.5,235.3c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C679.8,235.3,679.6,235.3,679.5,235.3z M677.2,232\n\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L677.2,232z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M673.8,235.2c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C674,235.2,673.9,235.2,673.8,235.2z\n\t\t\t\t\t M671.5,232l2.3,2.2l2.2-2.1l-2.3-2.2L671.5,232z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M668.1,235.4c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C668.3,235.3,668.2,235.4,668.1,235.4z\n\t\t\t\t\t M665.8,232.1l2.3,2.2l2.2-2.1L668,230L665.8,232.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M681.9,258.4c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC682.4,258.2,682.2,258.4,681.9,258.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M685.2,258.4c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC685.7,258.2,685.5,258.4,685.2,258.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M678.3,258.4c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC678.7,258.2,678.5,258.4,678.3,258.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M681.6,258.4c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC682,258.2,681.8,258.4,681.6,258.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.7,258.4c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC675.1,258.2,674.9,258.4,674.7,258.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M677.9,258.4c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC678.4,258.2,678.2,258.4,677.9,258.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M671,258.4c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC671.5,258.2,671.3,258.4,671,258.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.3,258.4c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC674.8,258.2,674.6,258.4,674.3,258.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M667.4,258.4c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.3,0,6-1.3,9.6c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC667.9,258.2,667.7,258.4,667.4,258.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M670.7,258.4c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.6l0,1.5\n\t\t\t\tC671.1,258.2,670.9,258.4,670.7,258.4z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M685.4,261.6c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C685.6,261.6,685.5,261.6,685.4,261.6z\n\t\t\t\t\t M683.1,258.4l2.3,2.2l2.2-2.1l-2.3-2.2L683.1,258.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M679.5,261.6c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C679.8,261.5,679.6,261.6,679.5,261.6z\n\t\t\t\t\t M677.2,258.3l2.3,2.2l2.2-2.1l-2.3-2.2L677.2,258.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M673.8,261.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C674,261.5,673.9,261.5,673.8,261.5z\n\t\t\t\t\t M671.5,258.2l2.3,2.2l2.2-2.1l-2.3-2.2L671.5,258.2z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M668.1,261.6c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C668.3,261.6,668.2,261.6,668.1,261.6z\n\t\t\t\t\t M665.8,258.4l2.3,2.2l2.2-2.1l-2.3-2.2L665.8,258.4z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M681.9,282.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC682.4,282.5,682.2,282.7,681.9,282.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M685.2,282.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC685.7,282.5,685.5,282.7,685.2,282.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M678.3,282.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC678.7,282.5,678.5,282.7,678.3,282.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M681.6,282.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC682,282.5,681.8,282.7,681.6,282.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.7,282.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC675.1,282.5,674.9,282.7,674.7,282.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M677.9,282.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC678.4,282.5,678.2,282.7,677.9,282.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M671,282.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.4c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.4c0,3.3,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC671.5,282.5,671.3,282.7,671,282.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M674.3,282.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.4c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.7l0,1.4\n\t\t\t\tC674.8,282.5,674.6,282.7,674.3,282.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M667.4,282.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-9.9c1.3-3.5,1.3-6,1.3-9.3\n\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.3,0,5.9-1.3,9.6c-2,5.4-2,6.2-1.9,9.6c0,0.6,0,1.3,0,2.1\n\t\t\t\tC667.9,282.5,667.7,282.7,667.4,282.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M670.7,282.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.3c-2.1-5.5-2-6.5-2-9.9c0-0.6,0-1.3,0-2.1\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.4-0.1,4.2,1.9,9.6c1.4,3.7,1.4,6.3,1.3,9.6l0,1.5\n\t\t\t\tC671.1,282.5,670.9,282.7,670.7,282.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M685.4,285.9c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C685.6,285.9,685.5,285.9,685.4,285.9z\n\t\t\t\t\t M683.1,282.7l2.3,2.2l2.2-2.1l-2.3-2.2L683.1,282.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M679.5,285.9c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C679.8,285.8,679.6,285.9,679.5,285.9z\n\t\t\t\t\t M677.2,282.6l2.3,2.2l2.2-2.1l-2.3-2.2L677.2,282.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M673.8,285.8c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.4-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.7C674,285.8,673.9,285.8,673.8,285.8z\n\t\t\t\t\t M671.5,282.5l2.3,2.2l2.2-2.1l-2.3-2.2L671.5,282.5z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M668.1,285.9c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.7\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.7C668.3,285.9,668.2,285.9,668.1,285.9z\n\t\t\t\t\t M665.8,282.7l2.3,2.2l2.2-2.1l-2.3-2.2L665.8,282.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g></g>\n<g>\n<path d='M49.6,55.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC50.1,54.9,49.9,55.1,49.6,55.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M52.9,55.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC53.4,54.9,53.2,55.1,52.9,55.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M46,55.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4l0-1.5\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC46.5,54.9,46.3,55.1,46,55.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M49.3,55.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC49.7,54.9,49.5,55.1,49.3,55.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42.4,55.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC42.8,54.9,42.6,55.1,42.4,55.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M45.7,55.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC46.1,54.9,45.9,55.1,45.7,55.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.7,55.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC39.2,54.9,39,55.1,38.7,55.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42,55.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC42.5,54.9,42.3,55.1,42,55.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M35.1,55.1c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC35.6,54.9,35.4,55.1,35.1,55.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.4,55.1c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC38.9,54.9,38.7,55.1,38.4,55.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M53.1,58.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C53.3,58.4,53.2,58.5,53.1,58.5z\n\t\t\t\t\t\t M50.8,55.2l2.3,2.2l2.2-2.1L53,53L50.8,55.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M47.2,58.4c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C47.5,58.3,47.4,58.4,47.2,58.4z M44.9,55.1\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L44.9,55.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M41.5,58.3c-0.1,0-0.2,0-0.3-0.1l-3-2.8C38.1,55.3,38,55.1,38,55s0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C41.7,58.3,41.6,58.3,41.5,58.3z M39.2,55\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L39.2,55z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M35.8,58.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C36,58.4,35.9,58.5,35.8,58.5z M33.5,55.2\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1L35.7,53L33.5,55.2z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M49.6,79.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC50.1,79.5,49.9,79.7,49.6,79.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M52.9,79.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC53.4,79.5,53.2,79.7,52.9,79.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M46,79.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4l0-1.5\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC46.5,79.5,46.3,79.7,46,79.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M49.3,79.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC49.7,79.5,49.5,79.7,49.3,79.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42.4,79.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC42.8,79.5,42.6,79.7,42.4,79.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M45.7,79.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC46.1,79.5,45.9,79.7,45.7,79.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.7,79.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC39.2,79.5,39,79.7,38.7,79.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42,79.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC42.5,79.5,42.3,79.7,42,79.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M35.1,79.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.1\n\t\t\t\t\tC35.6,79.5,35.4,79.7,35.1,79.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.4,79.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC38.9,79.5,38.7,79.7,38.4,79.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M53.1,83c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C53.3,82.9,53.2,83,53.1,83z M50.8,79.7\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1L53,77.5L50.8,79.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M47.2,82.9c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C47.5,82.9,47.4,82.9,47.2,82.9z\n\t\t\t\t\t\t M44.9,79.6l2.3,2.2l2.2-2.1l-2.3-2.2L44.9,79.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M41.5,82.8c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C41.7,82.8,41.6,82.8,41.5,82.8z\n\t\t\t\t\t\t M39.2,79.5l2.3,2.2l2.2-2.1l-2.3-2.2L39.2,79.5z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M35.8,83c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C36,82.9,35.9,83,35.8,83z M33.5,79.7\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L33.5,79.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M49.6,106.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC50.1,106,49.9,106.2,49.6,106.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M52.9,106.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC53.4,106,53.2,106.2,52.9,106.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M46,106.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4l0-1.5\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC46.5,106,46.3,106.2,46,106.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M49.3,106.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC49.7,106,49.5,106.2,49.3,106.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42.4,106.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC42.8,106,42.6,106.2,42.4,106.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M45.7,106.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC46.1,106,45.9,106.2,45.7,106.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.7,106.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC39.2,106,39,106.2,38.7,106.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42,106.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC42.5,106,42.3,106.2,42,106.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M35.1,106.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.1\n\t\t\t\t\tC35.6,106,35.4,106.2,35.1,106.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.4,106.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c0,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC38.9,106,38.7,106.2,38.4,106.2z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M53.1,109.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C53.3,109.4,53.2,109.5,53.1,109.5z M50.8,106.2\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L50.8,106.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M47.2,109.4c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C47.5,109.4,47.4,109.4,47.2,109.4z\n\t\t\t\t\t\t M44.9,106.1l2.3,2.2l2.2-2.1l-2.3-2.2L44.9,106.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M41.5,109.3c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C41.7,109.3,41.6,109.3,41.5,109.3z\n\t\t\t\t\t\t M39.2,106.1l2.3,2.2l2.2-2.1l-2.3-2.2L39.2,106.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M35.8,109.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C36,109.4,35.9,109.5,35.8,109.5z M33.5,106.2\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L33.5,106.2z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M49.6,130.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC50.1,130.5,49.9,130.7,49.6,130.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M52.9,130.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC53.4,130.5,53.2,130.7,52.9,130.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M46,130.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4l0-1.5\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC46.5,130.5,46.3,130.7,46,130.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M49.3,130.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC49.7,130.5,49.5,130.7,49.3,130.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42.4,130.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC42.8,130.5,42.6,130.7,42.4,130.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M45.7,130.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC46.1,130.5,45.9,130.7,45.7,130.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.7,130.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC39.2,130.5,39,130.7,38.7,130.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42,130.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC42.5,130.5,42.3,130.7,42,130.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M35.1,130.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.1\n\t\t\t\t\tC35.6,130.5,35.4,130.7,35.1,130.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.4,130.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC38.9,130.5,38.7,130.7,38.4,130.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M53.1,134c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C53.3,134,53.2,134,53.1,134z M50.8,130.7\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L50.8,130.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M47.2,133.9c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C47.5,133.9,47.4,133.9,47.2,133.9z M44.9,130.6\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L44.9,130.6z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M41.5,133.9c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C41.7,133.8,41.6,133.9,41.5,133.9z\n\t\t\t\t\t\t M39.2,130.6l2.3,2.2l2.2-2.1l-2.3-2.2L39.2,130.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M35.8,134c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C36,134,35.9,134,35.8,134z M33.5,130.7l2.3,2.2\n\t\t\t\t\t\tl2.2-2.1l-2.3-2.2L33.5,130.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M49.6,157.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC50.1,157,49.9,157.2,49.6,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M52.9,157.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC53.4,157,53.2,157.2,52.9,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M46,157.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4l0-1.5\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC46.5,157,46.3,157.2,46,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M49.3,157.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC49.7,157,49.5,157.2,49.3,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42.4,157.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC42.8,157,42.6,157.2,42.4,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M45.7,157.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC46.1,157,45.9,157.2,45.7,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.7,157.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC39.2,157,39,157.2,38.7,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42,157.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC42.5,157,42.3,157.2,42,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M35.1,157.2c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.1\n\t\t\t\t\tC35.6,157,35.4,157.2,35.1,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.4,157.2c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC38.9,157,38.7,157.2,38.4,157.2z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M53.1,160.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C53.3,160.5,53.2,160.5,53.1,160.5z M50.8,157.2\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L50.8,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M47.2,160.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C47.5,160.4,47.4,160.5,47.2,160.5z\n\t\t\t\t\t\t M44.9,157.2l2.3,2.2l2.2-2.1l-2.3-2.2L44.9,157.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M41.5,160.4c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C41.7,160.3,41.6,160.4,41.5,160.4z\n\t\t\t\t\t\t M39.2,157.1l2.3,2.2l2.2-2.1l-2.3-2.2L39.2,157.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M35.8,160.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C36,160.5,35.9,160.5,35.8,160.5z M33.5,157.2\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L33.5,157.2z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M49.6,181.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC50.1,181.5,49.9,181.7,49.6,181.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M52.9,181.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC53.4,181.5,53.2,181.7,52.9,181.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M46,181.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4l0-1.5\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC46.5,181.5,46.3,181.7,46,181.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M49.3,181.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC49.7,181.5,49.5,181.7,49.3,181.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42.4,181.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC42.8,181.5,42.6,181.7,42.4,181.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M45.7,181.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC46.1,181.5,45.9,181.7,45.7,181.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.7,181.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC39.2,181.5,39,181.7,38.7,181.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42,181.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC42.5,181.5,42.3,181.7,42,181.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M35.1,181.7c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.1\n\t\t\t\t\tC35.6,181.5,35.4,181.7,35.1,181.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.4,181.7c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c0,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC38.9,181.5,38.7,181.7,38.4,181.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M53.1,185.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C53.3,185,53.2,185.1,53.1,185.1z\n\t\t\t\t\t\t M50.8,181.8l2.3,2.2l2.2-2.1l-2.3-2.2L50.8,181.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M47.2,185c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C47.5,184.9,47.4,185,47.2,185z\n\t\t\t\t\t\t M44.9,181.7l2.3,2.2l2.2-2.1l-2.3-2.2L44.9,181.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M41.5,184.9c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C41.7,184.9,41.6,184.9,41.5,184.9z\n\t\t\t\t\t\t M39.2,181.6l2.3,2.2l2.2-2.1l-2.3-2.2L39.2,181.6z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M35.8,185.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C36,185,35.9,185.1,35.8,185.1z\n\t\t\t\t\t\t M33.5,181.8l2.3,2.2l2.2-2.1l-2.3-2.2L33.5,181.8z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M49.6,208.3c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC50.1,208.1,49.9,208.3,49.6,208.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M52.9,208.3c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC53.4,208.1,53.2,208.3,52.9,208.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M46,208.3c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4l0-1.5\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC46.5,208.1,46.3,208.3,46,208.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M49.3,208.3c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC49.7,208.1,49.5,208.3,49.3,208.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42.4,208.3c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC42.8,208.1,42.6,208.3,42.4,208.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M45.7,208.3c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC46.1,208.1,45.9,208.3,45.7,208.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.7,208.3c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC39.2,208.1,39,208.3,38.7,208.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42,208.3c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC42.5,208.1,42.3,208.3,42,208.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M35.1,208.3c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.1\n\t\t\t\t\tC35.6,208.1,35.4,208.3,35.1,208.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.4,208.3c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC38.9,208.1,38.7,208.3,38.4,208.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M53.1,211.6c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C53.3,211.5,53.2,211.6,53.1,211.6z\n\t\t\t\t\t\t M50.8,208.3l2.3,2.2l2.2-2.1l-2.3-2.2L50.8,208.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M47.2,211.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C47.5,211.5,47.4,211.5,47.2,211.5z\n\t\t\t\t\t\t M44.9,208.2l2.3,2.2l2.2-2.1l-2.3-2.2L44.9,208.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M41.5,211.4c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C41.7,211.4,41.6,211.4,41.5,211.4z\n\t\t\t\t\t\t M39.2,208.1l2.3,2.2l2.2-2.1l-2.3-2.2L39.2,208.1z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M35.8,211.6c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C36,211.5,35.9,211.6,35.8,211.6z\n\t\t\t\t\t\t M33.5,208.3l2.3,2.2l2.2-2.1l-2.3-2.2L33.5,208.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M49.6,232.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC50.1,232.6,49.9,232.8,49.6,232.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M52.9,232.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC53.4,232.6,53.2,232.8,52.9,232.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M46,232.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4l0-1.5\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC46.5,232.6,46.3,232.8,46,232.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M49.3,232.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC49.7,232.6,49.5,232.8,49.3,232.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42.4,232.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC42.8,232.6,42.6,232.8,42.4,232.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M45.7,232.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC46.1,232.6,45.9,232.8,45.7,232.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.7,232.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC39.2,232.6,39,232.8,38.7,232.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42,232.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC42.5,232.6,42.3,232.8,42,232.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M35.1,232.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.1\n\t\t\t\t\tC35.6,232.6,35.4,232.8,35.1,232.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.4,232.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC38.9,232.6,38.7,232.8,38.4,232.8z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M53.1,236.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0.1-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C53.3,236.1,53.2,236.1,53.1,236.1z\n\t\t\t\t\t\t M50.8,232.8l2.3,2.2l2.2-2.1l-2.3-2.2L50.8,232.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M47.2,236c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C47.5,236,47.4,236,47.2,236z M44.9,232.7\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L44.9,232.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M41.5,236c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C41.7,235.9,41.6,236,41.5,236z\n\t\t\t\t\t\t M39.2,232.7l2.3,2.2l2.2-2.1l-2.3-2.2L39.2,232.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M35.8,236.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0.1-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C36,236.1,35.9,236.1,35.8,236.1z\n\t\t\t\t\t\t M33.5,232.8l2.3,2.2l2.2-2.1l-2.3-2.2L33.5,232.8z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M49.6,259.3c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC50.1,259.1,49.9,259.3,49.6,259.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M52.9,259.3c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC53.4,259.1,53.2,259.3,52.9,259.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M46,259.3c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4l0-1.5\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC46.5,259.1,46.3,259.3,46,259.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M49.3,259.3c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC49.7,259.1,49.5,259.3,49.3,259.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42.4,259.3c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC42.8,259.1,42.6,259.3,42.4,259.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M45.7,259.3c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC46.1,259.1,45.9,259.3,45.7,259.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.7,259.3c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC39.2,259.1,39,259.3,38.7,259.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42,259.3c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC42.5,259.1,42.3,259.3,42,259.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M35.1,259.3c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.1\n\t\t\t\t\tC35.6,259.1,35.4,259.3,35.1,259.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.4,259.3c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC38.9,259.1,38.7,259.3,38.4,259.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M53.1,262.6c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C53.3,262.6,53.2,262.6,53.1,262.6z\n\t\t\t\t\t\t M50.8,259.3l2.3,2.2l2.2-2.1l-2.3-2.2L50.8,259.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M47.2,262.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1-0.1,0.2-0.1,0.3l-2.9,2.8C47.5,262.5,47.4,262.5,47.2,262.5z\n\t\t\t\t\t\t M44.9,259.2l2.3,2.2l2.2-2.1l-2.3-2.2L44.9,259.2z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M41.5,262.5c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1-0.1,0.2-0.1,0.3l-2.9,2.8C41.7,262.4,41.6,262.5,41.5,262.5z\n\t\t\t\t\t\t M39.2,259.2l2.3,2.2l2.2-2.1l-2.3-2.2L39.2,259.2z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M35.8,262.6c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C36,262.6,35.9,262.6,35.8,262.6z\n\t\t\t\t\t\t M33.5,259.3l2.3,2.2l2.2-2.1l-2.3-2.2L33.5,259.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M49.6,283.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC50.1,283.6,49.9,283.8,49.6,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M52.9,283.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC53.4,283.6,53.2,283.8,52.9,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M46,283.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4l0-1.5\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC46.5,283.6,46.3,283.8,46,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M49.3,283.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC49.7,283.6,49.5,283.8,49.3,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42.4,283.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC42.8,283.6,42.6,283.8,42.4,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M45.7,283.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC46.1,283.6,45.9,283.8,45.7,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.7,283.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.2\n\t\t\t\t\tC39.2,283.6,39,283.8,38.7,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M42,283.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.2c-0.1,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC42.5,283.6,42.3,283.8,42,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M35.1,283.8c-0.3,0-0.5-0.2-0.5-0.5c0-0.8,0-1.5,0-2.1c-0.1-3.5-0.1-4.4,2-10c1.3-3.6,1.3-6,1.3-9.4\n\t\t\t\t\tl0-1.5c0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5l0,1.5c0,3.4,0,6-1.3,9.7c-2,5.4-2,6.2-1.9,9.7c0,0.6,0,1.3,0,2.1\n\t\t\t\t\tC35.6,283.6,35.4,283.8,35.1,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M38.4,283.8c-0.3,0-0.5-0.2-0.5-0.5l0-1.5c0-3.4,0-5.8-1.3-9.4c-2.1-5.6-2-6.5-2-10c0-0.6,0-1.3,0-2.1\n\t\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5c0.3,0,0.5,0.2,0.5,0.5c0,0.8,0,1.5,0,2.1c0,3.5-0.1,4.3,1.9,9.7c1.4,3.7,1.4,6.4,1.3,9.7l0,1.5\n\t\t\t\t\tC38.9,283.6,38.7,283.8,38.4,283.8z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M53.1,287.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C53.3,287.1,53.2,287.1,53.1,287.1z M50.8,283.8\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L50.8,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M47.2,287.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C47.5,287,47.4,287.1,47.2,287.1z M44.9,283.8\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L44.9,283.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M41.5,287c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-2.9,2.8C41.7,287,41.6,287,41.5,287z M39.2,283.7\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L39.2,283.7z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M35.8,287.1c-0.1,0-0.2,0-0.3-0.1l-3-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l2.9-2.8\n\t\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l3,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-2.9,2.8C36,287.1,35.9,287.1,35.8,287.1z M33.5,283.8\n\t\t\t\t\t\tl2.3,2.2l2.2-2.1l-2.3-2.2L33.5,283.8z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M73.9,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C74.8,270.8,74.4,270.8,73.9,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M57.2,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C61.2,270.5,59.8,270.8,57.2,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M73.9,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C74.8,274.3,74.4,274.3,73.9,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M57.2,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C61.2,274.1,59.8,274.3,57.2,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M73.9,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C74.8,277.9,74.3,277.9,73.9,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M57.2,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C61.2,277.6,59.8,277.8,57.2,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M73.9,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C74.8,281.4,74.3,281.4,73.9,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M57.2,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C61.2,281.1,59.8,281.3,57.2,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M73.9,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C74.8,284.9,74.3,284.9,73.9,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M57.2,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C61.2,284.6,59.8,284.9,57.2,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M78.1,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C78.3,270.3,78.2,270.3,78.1,270.3z M75.8,267.1\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L75.8,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M78,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C78.2,275.9,78.1,276,78,276z M75.7,272.7\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L75.7,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M77.9,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C78.1,281.6,78,281.6,77.9,281.6z\n\t\t\t\t\t M75.7,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L75.7,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M78.1,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C78.3,287.1,78.2,287.1,78.1,287.1z\n\t\t\t\t\t M75.8,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L75.8,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M99.5,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C100.4,270.8,99.9,270.8,99.5,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M82.8,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C86.8,270.5,85.4,270.8,82.8,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M99.5,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C100.4,274.3,99.9,274.3,99.5,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M82.8,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C86.8,274.1,85.4,274.3,82.8,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M99.5,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C100.4,277.9,99.9,277.9,99.5,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M82.7,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C86.8,277.6,85.4,277.8,82.7,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M99.5,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C100.4,281.4,99.9,281.4,99.5,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M82.7,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C86.8,281.1,85.4,281.3,82.7,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M99.5,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C100.4,284.9,99.9,284.9,99.5,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M82.7,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C86.8,284.6,85.4,284.9,82.7,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M103.6,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C103.8,270.3,103.7,270.3,103.6,270.3z\n\t\t\t\t\t M101.4,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L101.4,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M103.5,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C103.8,275.9,103.6,276,103.5,276z\n\t\t\t\t\t M101.3,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L101.3,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M103.5,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C103.7,281.6,103.6,281.6,103.5,281.6z\n\t\t\t\t\t M101.2,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L101.2,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M103.6,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C103.8,287.1,103.7,287.1,103.6,287.1z\n\t\t\t\t\t M101.4,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L101.4,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M125,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C125.9,270.8,125.5,270.8,125,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M108.3,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C112.3,270.5,110.9,270.8,108.3,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M125,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C125.9,274.3,125.5,274.3,125,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M108.3,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C112.3,274.1,110.9,274.3,108.3,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M125,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C125.9,277.9,125.4,277.9,125,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M108.3,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C112.3,277.6,110.9,277.8,108.3,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M125,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C125.9,281.4,125.4,281.4,125,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M108.3,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C112.3,281.1,110.9,281.3,108.3,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M125,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C125.9,284.9,125.4,284.9,125,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M108.3,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C112.3,284.6,110.9,284.9,108.3,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M129.2,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C129.4,270.3,129.3,270.3,129.2,270.3z\n\t\t\t\t\t M126.9,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L126.9,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M129.1,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C129.3,275.9,129.2,276,129.1,276z\n\t\t\t\t\t M126.9,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L126.9,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M129,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C129.2,281.6,129.1,281.6,129,281.6z\n\t\t\t\t\t M126.8,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L126.8,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M129.2,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C129.4,287.1,129.3,287.1,129.2,287.1z\n\t\t\t\t\t M126.9,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L126.9,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M150.6,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C151.5,270.8,151,270.8,150.6,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M133.9,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C137.9,270.5,136.5,270.8,133.9,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M150.6,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C151.5,274.3,151,274.3,150.6,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M133.9,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C137.9,274.1,136.5,274.3,133.9,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M150.6,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C151.5,277.9,151,277.9,150.6,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M133.8,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C137.9,277.6,136.5,277.8,133.8,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M150.6,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C151.5,281.4,151,281.4,150.6,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M133.8,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C137.9,281.1,136.5,281.3,133.8,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M150.6,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C151.5,284.9,151,284.9,150.6,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M133.8,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C137.9,284.6,136.5,284.9,133.8,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M154.7,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C154.9,270.3,154.8,270.3,154.7,270.3z\n\t\t\t\t\t M152.5,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L152.5,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M154.6,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C154.9,275.9,154.8,276,154.6,276z\n\t\t\t\t\t M152.4,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L152.4,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M154.6,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C154.8,281.6,154.7,281.6,154.6,281.6z\n\t\t\t\t\t M152.3,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L152.3,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M154.7,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C154.9,287.1,154.8,287.1,154.7,287.1z\n\t\t\t\t\t M152.5,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L152.5,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M176.1,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C177,270.8,176.6,270.8,176.1,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M159.4,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C163.5,270.5,162,270.8,159.4,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M176.1,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C177,274.3,176.6,274.3,176.1,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M159.4,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C163.5,274.1,162,274.3,159.4,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M176.1,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C177,277.9,176.6,277.9,176.1,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M159.4,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C163.4,277.6,162,277.8,159.4,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M176.1,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C177,281.4,176.6,281.4,176.1,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M159.4,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C163.4,281.1,162,281.3,159.4,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M176.1,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C177,284.9,176.6,284.9,176.1,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M159.4,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C163.4,284.6,162,284.9,159.4,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M180.3,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C180.5,270.3,180.4,270.3,180.3,270.3z M178,267.1\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L178,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M180.2,276c-0.1,0-0.2,0-0.3-0.1L177,273c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C180.4,275.9,180.3,276,180.2,276z\n\t\t\t\t\t M178,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L178,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M180.1,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C180.3,281.6,180.2,281.6,180.1,281.6z\n\t\t\t\t\t M177.9,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L177.9,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M180.3,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C180.5,287.1,180.4,287.1,180.3,287.1z\n\t\t\t\t\t M178,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L178,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M201.7,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C202.6,270.8,202.1,270.8,201.7,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M185,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C189,270.5,187.6,270.8,185,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M201.7,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C202.6,274.3,202.1,274.3,201.7,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M185,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C189,274.1,187.6,274.3,185,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M201.7,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C202.6,277.9,202.1,277.9,201.7,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M185,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C189,277.6,187.6,277.8,185,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M201.7,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C202.6,281.4,202.1,281.4,201.7,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M185,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C189,281.1,187.6,281.3,185,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M201.7,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C202.6,284.9,202.1,284.9,201.7,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M185,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C189,284.6,187.6,284.9,185,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M205.8,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C206.1,270.3,205.9,270.3,205.8,270.3z\n\t\t\t\t\t M203.6,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L203.6,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M205.7,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C206,275.9,205.9,276,205.7,276z\n\t\t\t\t\t M203.5,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L203.5,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M205.7,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C205.9,281.6,205.8,281.6,205.7,281.6z\n\t\t\t\t\t M203.4,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L203.4,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M205.8,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C206.1,287.1,205.9,287.1,205.8,287.1z\n\t\t\t\t\t M203.6,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L203.6,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M227.2,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C228.1,270.8,227.7,270.8,227.2,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M210.5,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C214.6,270.5,213.1,270.8,210.5,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M227.2,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C228.1,274.3,227.7,274.3,227.2,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M210.5,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C214.6,274.1,213.1,274.3,210.5,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M227.2,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C228.1,277.9,227.7,277.9,227.2,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M210.5,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C214.5,277.6,213.1,277.8,210.5,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M227.2,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C228.1,281.4,227.7,281.4,227.2,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M210.5,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C214.5,281.1,213.1,281.3,210.5,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M227.2,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C228.1,284.9,227.7,284.9,227.2,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M210.5,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C214.5,284.6,213.1,284.9,210.5,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M231.4,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C231.6,270.3,231.5,270.3,231.4,270.3z\n\t\t\t\t\t M229.1,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L229.1,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M231.3,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C231.5,275.9,231.4,276,231.3,276z\n\t\t\t\t\t M229.1,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L229.1,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M231.2,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C231.5,281.6,231.3,281.6,231.2,281.6z\n\t\t\t\t\t M229,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L229,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M231.4,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C231.6,287.1,231.5,287.1,231.4,287.1z\n\t\t\t\t\t M229.1,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L229.1,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M252.8,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C253.7,270.8,253.2,270.8,252.8,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M236.1,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C240.1,270.5,238.7,270.8,236.1,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M252.8,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C253.7,274.3,253.2,274.3,252.8,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M236.1,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C240.1,274.1,238.7,274.3,236.1,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M252.8,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C253.7,277.9,253.2,277.9,252.8,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M236.1,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C240.1,277.6,238.7,277.8,236.1,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M252.8,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C253.7,281.4,253.2,281.4,252.8,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M236.1,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C240.1,281.1,238.7,281.3,236.1,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M252.8,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C253.7,284.9,253.2,284.9,252.8,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M236.1,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C240.1,284.6,238.7,284.9,236.1,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M256.9,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C257.2,270.3,257,270.3,256.9,270.3z M254.7,267.1\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L254.7,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M256.9,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C257.1,275.9,257,276,256.9,276z\n\t\t\t\t\t M254.6,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L254.6,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M256.8,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C257,281.6,256.9,281.6,256.8,281.6z\n\t\t\t\t\t M254.5,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L254.5,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M256.9,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C257.2,287.1,257,287.1,256.9,287.1z\n\t\t\t\t\t M254.7,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L254.7,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M278.3,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C279.2,270.8,278.8,270.8,278.3,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M261.6,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C265.7,270.5,264.2,270.8,261.6,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M278.3,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C279.2,274.3,278.8,274.3,278.3,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M261.6,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C265.7,274.1,264.2,274.3,261.6,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M278.3,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C279.2,277.9,278.8,277.9,278.3,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M261.6,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C265.6,277.6,264.2,277.8,261.6,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M278.3,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C279.2,281.4,278.8,281.4,278.3,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M261.6,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C265.6,281.1,264.2,281.3,261.6,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M278.3,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C279.2,284.9,278.8,284.9,278.3,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M261.6,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C265.6,284.6,264.2,284.9,261.6,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M282.5,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C282.7,270.3,282.6,270.3,282.5,270.3z\n\t\t\t\t\t M280.2,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L280.2,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M282.4,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C282.6,275.9,282.5,276,282.4,276z\n\t\t\t\t\t M280.2,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L280.2,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M282.3,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C282.6,281.6,282.4,281.6,282.3,281.6z\n\t\t\t\t\t M280.1,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L280.1,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M282.5,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C282.7,287.1,282.6,287.1,282.5,287.1z\n\t\t\t\t\t M280.2,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L280.2,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M303.9,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C304.8,270.8,304.3,270.8,303.9,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M287.2,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C291.2,270.5,289.8,270.8,287.2,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M303.9,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C304.8,274.3,304.3,274.3,303.9,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M287.2,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C291.2,274.1,289.8,274.3,287.2,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M303.9,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C304.8,277.9,304.3,277.9,303.9,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M287.2,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C291.2,277.6,289.8,277.8,287.2,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M303.9,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C304.8,281.4,304.3,281.4,303.9,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M287.2,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C291.2,281.1,289.8,281.3,287.2,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M303.9,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C304.8,284.9,304.3,284.9,303.9,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M287.2,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C291.2,284.6,289.8,284.9,287.2,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M308,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C308.3,270.3,308.1,270.3,308,270.3z M305.8,267.1\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L305.8,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M308,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C308.2,275.9,308.1,276,308,276z\n\t\t\t\t\t M305.7,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L305.7,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M307.9,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C308.1,281.6,308,281.6,307.9,281.6z\n\t\t\t\t\t M305.6,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L305.6,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M308,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C308.3,287.1,308.1,287.1,308,287.1z\n\t\t\t\t\t M305.8,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L305.8,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M329.5,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C330.3,270.8,329.9,270.8,329.5,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M312.7,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C316.8,270.5,315.3,270.8,312.7,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M329.5,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C330.3,274.3,329.9,274.3,329.5,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M312.7,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C316.8,274.1,315.3,274.3,312.7,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M329.4,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C330.3,277.9,329.9,277.9,329.4,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M312.7,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C316.8,277.6,315.3,277.8,312.7,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M329.4,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C330.3,281.4,329.9,281.4,329.4,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M312.7,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C316.8,281.1,315.3,281.3,312.7,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M329.4,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C330.3,284.9,329.9,284.9,329.4,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M312.7,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C316.8,284.6,315.3,284.9,312.7,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M333.6,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C333.8,270.3,333.7,270.3,333.6,270.3z\n\t\t\t\t\t M331.3,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L331.3,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M333.5,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C333.7,275.9,333.6,276,333.5,276z\n\t\t\t\t\t M331.3,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L331.3,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M333.4,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C333.7,281.6,333.5,281.6,333.4,281.6z\n\t\t\t\t\t M331.2,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L331.2,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M333.6,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C333.8,287.1,333.7,287.1,333.6,287.1z\n\t\t\t\t\t M331.3,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L331.3,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M355,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C355.9,270.8,355.4,270.8,355,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M338.3,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C342.3,270.5,340.9,270.8,338.3,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M355,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C355.9,274.3,355.4,274.3,355,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M338.3,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C342.3,274.1,340.9,274.3,338.3,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M355,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C355.9,277.9,355.4,277.9,355,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M338.3,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C342.3,277.6,340.9,277.8,338.3,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M355,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C355.9,281.4,355.4,281.4,355,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M338.3,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C342.3,281.1,340.9,281.3,338.3,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M355,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C355.9,284.9,355.4,284.9,355,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M338.3,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C342.3,284.6,340.9,284.9,338.3,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M359.1,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C359.4,270.3,359.3,270.3,359.1,270.3z\n\t\t\t\t\t M356.9,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L356.9,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M359.1,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C359.3,275.9,359.2,276,359.1,276z\n\t\t\t\t\t M356.8,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L356.8,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M359,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C359.2,281.6,359.1,281.6,359,281.6z\n\t\t\t\t\t M356.8,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L356.8,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M359.1,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C359.4,287.1,359.3,287.1,359.1,287.1z\n\t\t\t\t\t M356.9,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L356.9,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M380.6,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C381.5,270.8,381,270.8,380.6,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M363.8,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.5,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C367.9,270.5,366.4,270.8,363.8,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M380.6,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C381.5,274.3,381,274.3,380.6,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M363.8,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.5,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C367.9,274.1,366.4,274.3,363.8,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M380.5,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C381.4,277.9,381,277.9,380.5,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M363.8,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C367.9,277.6,366.4,277.8,363.8,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M380.5,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C381.4,281.4,381,281.4,380.5,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M363.8,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C367.9,281.1,366.4,281.3,363.8,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M380.5,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C381.4,284.9,381,284.9,380.5,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M363.8,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C367.9,284.6,366.4,284.9,363.8,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M384.7,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C384.9,270.3,384.8,270.3,384.7,270.3z\n\t\t\t\t\t M382.5,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L382.5,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M384.6,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C384.8,275.9,384.7,276,384.6,276z\n\t\t\t\t\t M382.4,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L382.4,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M384.5,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C384.8,281.6,384.7,281.6,384.5,281.6z\n\t\t\t\t\t M382.3,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L382.3,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M384.7,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C384.9,287.1,384.8,287.1,384.7,287.1z\n\t\t\t\t\t M382.5,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L382.5,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M406.1,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C407,270.8,406.5,270.8,406.1,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M389.4,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C393.4,270.5,392,270.8,389.4,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M406.1,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C407,274.3,406.5,274.3,406.1,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M389.4,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C393.4,274.1,392,274.3,389.4,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M406.1,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C407,277.9,406.5,277.9,406.1,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M389.4,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C393.4,277.6,392,277.8,389.4,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M406.1,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C407,281.4,406.5,281.4,406.1,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M389.4,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C393.4,281.1,392,281.3,389.4,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M406.1,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C407,284.9,406.5,284.9,406.1,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M389.4,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C393.4,284.6,392,284.9,389.4,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M410.2,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C410.5,270.3,410.4,270.3,410.2,270.3z M408,267.1\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L408,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M410.2,276c-0.1,0-0.2,0-0.3-0.1L407,273c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C410.4,275.9,410.3,276,410.2,276z\n\t\t\t\t\t M407.9,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L407.9,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M410.1,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C410.3,281.6,410.2,281.6,410.1,281.6z\n\t\t\t\t\t M407.9,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L407.9,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M410.2,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C410.5,287.1,410.4,287.1,410.2,287.1z\n\t\t\t\t\t M408,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L408,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M431.7,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C432.6,270.8,432.1,270.8,431.7,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M414.9,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C419,270.5,417.5,270.8,414.9,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M431.7,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C432.6,274.3,432.1,274.3,431.7,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M414.9,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C419,274.1,417.5,274.3,414.9,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M431.7,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C432.5,277.9,432.1,277.9,431.7,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M414.9,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C419,277.6,417.5,277.8,414.9,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M431.7,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C432.5,281.4,432.1,281.4,431.7,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M414.9,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C419,281.1,417.5,281.3,414.9,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M431.7,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C432.5,284.9,432.1,284.9,431.7,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M414.9,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C419,284.6,417.5,284.9,414.9,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M435.8,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C436,270.3,435.9,270.3,435.8,270.3z M433.6,267.1\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L433.6,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M435.7,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C436,275.9,435.8,276,435.7,276z\n\t\t\t\t\t M433.5,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L433.5,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M435.6,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C435.9,281.6,435.8,281.6,435.6,281.6z\n\t\t\t\t\t M433.4,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L433.4,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M435.8,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C436,287.1,435.9,287.1,435.8,287.1z\n\t\t\t\t\t M433.6,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L433.6,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M457.2,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C458.1,270.8,457.7,270.8,457.2,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M440.5,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C444.5,270.5,443.1,270.8,440.5,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M457.2,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C458.1,274.3,457.7,274.3,457.2,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M440.5,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C444.5,274.1,443.1,274.3,440.5,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M457.2,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.6,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C458.1,277.9,457.6,277.9,457.2,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M440.5,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.5,0-6.1,0-9.8,1.2C444.5,277.6,443.1,277.8,440.5,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M457.2,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.6,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C458.1,281.4,457.6,281.4,457.2,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M440.5,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C444.5,281.1,443.1,281.3,440.5,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M457.2,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.6,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C458.1,284.9,457.6,284.9,457.2,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M440.5,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.5,0-6.1,0-9.8,1.2C444.5,284.6,443.1,284.9,440.5,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M461.3,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C461.6,270.3,461.5,270.3,461.3,270.3z\n\t\t\t\t\t M459.1,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L459.1,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M461.3,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C461.5,275.9,461.4,276,461.3,276z\n\t\t\t\t\t M459,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L459,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M461.2,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C461.4,281.6,461.3,281.6,461.2,281.6z\n\t\t\t\t\t M459,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L459,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M461.3,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C461.6,287.1,461.5,287.1,461.3,287.1z\n\t\t\t\t\t M459.1,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L459.1,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M482.8,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C483.7,270.8,483.2,270.8,482.8,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M466.1,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C470.1,270.5,468.7,270.8,466.1,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M482.8,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C483.7,274.3,483.2,274.3,482.8,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M466.1,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C470.1,274.1,468.7,274.3,466.1,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M482.8,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C483.7,277.9,483.2,277.9,482.8,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M466,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C470.1,277.6,468.6,277.8,466,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M482.8,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C483.7,281.4,483.2,281.4,482.8,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M466,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C470.1,281.1,468.6,281.3,466,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M482.8,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C483.7,284.9,483.2,284.9,482.8,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M466,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C470.1,284.6,468.6,284.9,466,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M486.9,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C487.1,270.3,487,270.3,486.9,270.3z M484.7,267.1\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L484.7,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M486.8,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C487.1,275.9,486.9,276,486.8,276z\n\t\t\t\t\t M484.6,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L484.6,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M486.8,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C487,281.6,486.9,281.6,486.8,281.6z\n\t\t\t\t\t M484.5,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L484.5,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M486.9,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C487.1,287.1,487,287.1,486.9,287.1z\n\t\t\t\t\t M484.7,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L484.7,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M508.3,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C509.2,270.8,508.8,270.8,508.3,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M491.6,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C495.6,270.5,494.2,270.8,491.6,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M508.3,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C509.2,274.3,508.8,274.3,508.3,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M491.6,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C495.6,274.1,494.2,274.3,491.6,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M508.3,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C509.2,277.9,508.7,277.9,508.3,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M491.6,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C495.6,277.6,494.2,277.8,491.6,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M508.3,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C509.2,281.4,508.7,281.4,508.3,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M491.6,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C495.6,281.1,494.2,281.3,491.6,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M508.3,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C509.2,284.9,508.7,284.9,508.3,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M491.6,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C495.6,284.6,494.2,284.9,491.6,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M512.5,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C512.7,270.3,512.6,270.3,512.5,270.3z\n\t\t\t\t\t M510.2,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L510.2,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M512.4,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C512.6,275.9,512.5,276,512.4,276z\n\t\t\t\t\t M510.1,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L510.1,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M512.3,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C512.5,281.6,512.4,281.6,512.3,281.6z\n\t\t\t\t\t M510.1,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L510.1,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M512.5,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C512.7,287.1,512.6,287.1,512.5,287.1z\n\t\t\t\t\t M510.2,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L510.2,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M533.9,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C534.8,270.8,534.3,270.8,533.9,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M517.2,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C521.2,270.5,519.8,270.8,517.2,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M533.9,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C534.8,274.3,534.3,274.3,533.9,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M517.2,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C521.2,274.1,519.8,274.3,517.2,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M533.9,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C534.8,277.9,534.3,277.9,533.9,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M517.1,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C521.2,277.6,519.7,277.8,517.1,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M533.9,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C534.8,281.4,534.3,281.4,533.9,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M517.1,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C521.2,281.1,519.7,281.3,517.1,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M533.9,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C534.8,284.9,534.3,284.9,533.9,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M517.1,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C521.2,284.6,519.7,284.9,517.1,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M538,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C538.2,270.3,538.1,270.3,538,270.3z M535.8,267.1\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L535.8,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M537.9,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C538.2,275.9,538,276,537.9,276z\n\t\t\t\t\t M535.7,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L535.7,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M537.9,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C538.1,281.6,538,281.6,537.9,281.6z\n\t\t\t\t\t M535.6,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L535.6,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M538,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C538.2,287.1,538.1,287.1,538,287.1z\n\t\t\t\t\t M535.8,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L535.8,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M559.4,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C560.3,270.8,559.9,270.8,559.4,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M542.7,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C546.7,270.5,545.3,270.8,542.7,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M559.4,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C560.3,274.3,559.9,274.3,559.4,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M542.7,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C546.7,274.1,545.3,274.3,542.7,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M559.4,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C560.3,277.9,559.8,277.9,559.4,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M542.7,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C546.7,277.6,545.3,277.8,542.7,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M559.4,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C560.3,281.4,559.8,281.4,559.4,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M542.7,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C546.7,281.1,545.3,281.3,542.7,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M559.4,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C560.3,284.9,559.8,284.9,559.4,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M542.7,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C546.7,284.6,545.3,284.9,542.7,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M563.6,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C563.8,270.3,563.7,270.3,563.6,270.3z\n\t\t\t\t\t M561.3,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L561.3,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M563.5,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C563.7,275.9,563.6,276,563.5,276z\n\t\t\t\t\t M561.3,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L561.3,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M563.4,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C563.6,281.6,563.5,281.6,563.4,281.6z\n\t\t\t\t\t M561.2,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L561.2,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M563.6,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C563.8,287.1,563.7,287.1,563.6,287.1z\n\t\t\t\t\t M561.3,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L561.3,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M585,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C585.9,270.8,585.4,270.8,585,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M568.3,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C572.3,270.5,570.9,270.8,568.3,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M585,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C585.9,274.3,585.4,274.3,585,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M568.3,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C572.3,274.1,570.9,274.3,568.3,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M585,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C585.9,277.9,585.4,277.9,585,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M568.2,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C572.3,277.6,570.9,277.8,568.2,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M585,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C585.9,281.4,585.4,281.4,585,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M568.2,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C572.3,281.1,570.9,281.3,568.2,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M585,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tl1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tc-0.9,0-1.6,0-2.2,0C585.9,284.9,585.4,284.9,585,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M568.2,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C572.3,284.6,570.9,284.9,568.2,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M589.1,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C589.3,270.3,589.2,270.3,589.1,270.3z\n\t\t\t\t\t M586.9,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L586.9,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M589,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C589.3,275.9,589.2,276,589,276z\n\t\t\t\t\t M586.8,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L586.8,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M589,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C589.2,281.6,589.1,281.6,589,281.6z\n\t\t\t\t\t M586.7,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L586.7,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M589.1,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C589.3,287.1,589.2,287.1,589.1,287.1z\n\t\t\t\t\t M586.9,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L586.9,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M610.5,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C611.4,270.8,611,270.8,610.5,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M593.8,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C597.8,270.5,596.4,270.8,593.8,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M610.5,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C611.4,274.3,611,274.3,610.5,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M593.8,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C597.8,274.1,596.4,274.3,593.8,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M610.5,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.6,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C611.4,277.9,611,277.9,610.5,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M593.8,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C597.8,277.6,596.4,277.8,593.8,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M610.5,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.6,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C611.4,281.4,611,281.4,610.5,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M593.8,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C597.8,281.1,596.4,281.3,593.8,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M610.5,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.6,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C611.4,284.9,611,284.9,610.5,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M593.8,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C597.8,284.6,596.4,284.9,593.8,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M614.7,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C614.9,270.3,614.8,270.3,614.7,270.3z\n\t\t\t\t\t M612.4,267.1l2.2,2.2l2.3-2.2l-2.2-2.2L612.4,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M614.6,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C614.8,275.9,614.7,276,614.6,276z\n\t\t\t\t\t M612.4,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L612.4,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M614.5,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C614.7,281.6,614.6,281.6,614.5,281.6z\n\t\t\t\t\t M612.3,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L612.3,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M614.7,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C614.9,287.1,614.8,287.1,614.7,287.1z\n\t\t\t\t\t M612.4,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L612.4,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M636.1,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C637,270.8,636.5,270.8,636.1,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M619.4,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C623.4,270.5,622,270.8,619.4,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M636.1,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C637,274.3,636.5,274.3,636.1,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M619.4,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C623.4,274.1,622,274.3,619.4,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M636.1,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C637,277.9,636.5,277.9,636.1,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M619.4,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5\n\t\t\t\tl-1.5,0c-3.6,0-6.1,0-9.8,1.2C623.4,277.6,622,277.8,619.4,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M636.1,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C637,281.4,636.5,281.4,636.1,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M619.4,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C623.4,281.1,622,281.3,619.4,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M636.1,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C637,284.9,636.5,284.9,636.1,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M619.4,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C623.4,284.6,622,284.9,619.4,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M640.2,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C640.4,270.3,640.3,270.3,640.2,270.3z M638,267.1\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L638,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M640.1,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C640.4,275.9,640.3,276,640.1,276z\n\t\t\t\t\t M637.9,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L637.9,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M640.1,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C640.3,281.6,640.2,281.6,640.1,281.6z\n\t\t\t\t\t M637.8,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L637.8,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M640.2,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C640.4,287.1,640.3,287.1,640.2,287.1z\n\t\t\t\t\t M638,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L638,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M661.6,270.8c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C662.5,270.8,662.1,270.8,661.6,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M644.9,270.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0.1,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C649,270.5,647.5,270.8,644.9,270.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M661.6,274.3c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.2,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.6,0,1.4,0,2.2,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C662.5,274.3,662.1,274.3,661.6,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M644.9,274.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.3,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.7-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C649,274.1,647.5,274.3,644.9,274.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M661.6,277.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C662.5,277.9,662.1,277.9,661.6,277.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M644.9,277.8c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C648.9,277.6,647.5,277.8,644.9,277.8z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M661.6,281.4c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\tc0-0.3,0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\ts-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C662.5,281.4,662.1,281.4,661.6,281.4z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M644.9,281.3c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5s-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C648.9,281.1,647.5,281.3,644.9,281.3z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M661.6,284.9c-2.6,0-4-0.2-9-1.9c-3.7-1.3-6.3-1.3-9.8-1.2l-1.5,0c-0.3,0-0.5-0.2-0.5-0.5\n\t\t\t\ts0.2-0.5,0.5-0.5l1.5,0c3.5,0,6.3,0,10.1,1.3c5.7,1.9,6.5,1.9,10.1,1.9c0.7,0,1.4,0,2.3,0c0.3,0,0.5,0.2,0.5,0.5\n\t\t\t\tc0,0.3-0.2,0.5-0.5,0.5c-0.9,0-1.6,0-2.2,0C662.5,284.9,662.1,284.9,661.6,284.9z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M644.9,284.9c-0.4,0-0.9,0-1.4,0c-0.6,0-1.4,0-2.2,0c-0.3,0-0.5-0.2-0.5-0.5c0-0.3,0.2-0.5,0.5-0.5\n\t\t\t\tc0.9,0,1.6,0,2.2,0c3.6,0,4.5,0.1,10.1-1.9c3.9-1.3,6.6-1.3,10.1-1.3l1.5,0c0.3,0,0.5,0.2,0.5,0.5c0,0.3-0.2,0.5-0.5,0.5l-1.5,0\n\t\t\t\tc-3.6,0-6.1,0-9.8,1.2C648.9,284.6,647.5,284.9,644.9,284.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M665.8,270.3c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3s0,0.2-0.1,0.3l-3,2.9C666,270.3,665.9,270.3,665.8,270.3z M663.5,267.1\n\t\t\t\t\tl2.2,2.2l2.3-2.2l-2.2-2.2L663.5,267.1z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M665.7,276c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C665.9,275.9,665.8,276,665.7,276z\n\t\t\t\t\t M663.5,272.7l2.2,2.2l2.3-2.2l-2.2-2.2L663.5,272.7z' fill='#F2C7DC'></path>\n</g>\n<g>\n<path d='M665.6,281.6c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3s0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C665.9,281.6,665.7,281.6,665.6,281.6z\n\t\t\t\t\t M663.4,278.3l2.2,2.2l2.3-2.2l-2.2-2.2L663.4,278.3z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g>\n<path d='M665.8,287.1c-0.1,0-0.2,0-0.3-0.1l-2.9-2.8c-0.1-0.1-0.1-0.2-0.1-0.3c0-0.1,0-0.2,0.1-0.3l3-2.9\n\t\t\t\t\tc0.2-0.2,0.5-0.2,0.6,0l2.9,2.8c0.1,0.1,0.1,0.2,0.1,0.3c0,0.1,0,0.2-0.1,0.3l-3,2.9C666,287.1,665.9,287.1,665.8,287.1z\n\t\t\t\t\t M663.5,283.9l2.2,2.2l2.3-2.2l-2.2-2.2L663.5,283.9z' fill='#F2C7DC'></path>\n</g>\n<g></g>\n<g></g>\n<g>\n<path d='M11.2,17.4c-2.6,0-4.7-0.7-6-2C1.9,12,3.8,5,3.9,4.7C3.9,4.4,4.2,4.1,4.5,4c0.1,0,2.3-0.6,4.7-0.6\n\t\t\t\tc2.6,0,4.7,0.7,6,2c3.4,3.4,1.4,10.4,1.4,10.7c-0.1,0.3-0.3,0.5-0.6,0.6C15.8,16.8,13.7,17.4,11.2,17.4z M5.5,5.7\n\t\t\t\tc-0.3,1.6-1.2,6.3,1,8.4c1,1,2.5,1.4,4.7,1.4c1.6,0,3-0.3,3.7-0.4c0.3-1.6,1.2-6.3-1-8.4c-1-1-2.5-1.4-4.7-1.4\n\t\t\t\tC7.7,5.2,6.2,5.5,5.5,5.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M5.1,8.3c-1.3,0-2.4-0.3-3-1C0.3,5.6,1.3,2,1.4,1.9c0-0.2,0.2-0.3,0.3-0.3c0,0,1.1-0.3,2.4-0.3\n\t\t\t\tc1.3,0,2.4,0.3,3,1c1.7,1.7,0.7,5.3,0.7,5.4c0,0.2-0.2,0.3-0.3,0.3C7.4,8,6.3,8.3,5.1,8.3z M2.2,2.4C2,3.1,1.6,5.5,2.7,6.6\n\t\t\t\tC3.2,7.1,4,7.4,5.1,7.4c0.8,0,1.5-0.1,1.9-0.2C7.1,6.3,7.5,4,6.4,2.9C5.9,2.4,5.2,2.1,4.1,2.1C3.3,2.1,2.5,2.3,2.2,2.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M9.9,14.4c-1.9,0-3.4-0.5-4.3-1.4c-2.4-2.4-1-7.6-1-7.8c0-0.2,0.2-0.3,0.3-0.3c0.1,0,1.7-0.5,3.5-0.5\n\t\t\t\tc1.9,0,3.4,0.5,4.3,1.4c2.4,2.4,1,7.6,1,7.8c0,0.2-0.2,0.3-0.3,0.3C13.4,13.9,11.8,14.4,9.9,14.4z M5.4,5.6c-0.2,1-1,4.9,0.8,6.7\n\t\t\t\tc0.8,0.8,2,1.2,3.7,1.2c1.3,0,2.5-0.2,3-0.4c0.2-1,1-4.9-0.8-6.7c-0.8-0.8-2-1.2-3.7-1.2C7.2,5.3,6,5.5,5.4,5.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M16.9,17.7H1c-0.3,0-0.5-0.2-0.5-0.5V1.3c0-0.3,0.2-0.5,0.5-0.5h15.9c0.3,0,0.5,0.2,0.5,0.5v15.9\n\t\t\tC17.4,17.5,17.2,17.7,16.9,17.7z M1.4,16.8h15v-15h-15V16.8z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g></g>\n<g>\n<path d='M709.4,17.5c-2.5,0-4.6-0.6-4.7-0.6c-0.3-0.1-0.5-0.3-0.6-0.6c-0.1-0.3-2-7.3,1.4-10.7c1.3-1.3,3.3-2,6-2\n\t\t\t\tc2.5,0,4.6,0.6,4.7,0.6c0.3,0.1,0.5,0.3,0.6,0.6c0.1,0.3,2,7.3-1.4,10.7C714.1,16.8,712.1,17.5,709.4,17.5z M705.7,15.2\n\t\t\t\tc0.7,0.2,2.2,0.4,3.7,0.4c1.5,0,3.5-0.3,4.7-1.4c2-2,1.5-6.4,1-8.4c-0.7-0.2-2.2-0.4-3.7-0.4c-1.5,0-3.5,0.3-4.7,1.4\n\t\t\t\tC704.5,9,705.3,13.7,705.7,15.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M715.6,8.4c-1.3,0-2.3-0.3-2.4-0.3c-0.2,0-0.3-0.2-0.3-0.3c0-0.2-1-3.7,0.7-5.4c0.7-0.7,1.7-1,3-1\n\t\t\t\tc1.3,0,2.3,0.3,2.4,0.3c0.2,0,0.3,0.2,0.3,0.3c0,0.2,1,3.7-0.7,5.4C717.9,8.1,716.9,8.4,715.6,8.4z M713.7,7.3\n\t\t\t\tc0.4,0.1,1.1,0.2,1.9,0.2c0.7,0,1.8-0.1,2.4-0.7c1.1-1.1,0.7-3.5,0.5-4.3c-0.4-0.1-1.1-0.2-1.9-0.2c-0.7,0-1.8,0.1-2.4,0.7\n\t\t\t\tC713.1,4.1,713.5,6.5,713.7,7.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M710.7,14.5c-1.8,0-3.4-0.4-3.5-0.5c-0.2,0-0.3-0.2-0.3-0.3c-0.1-0.2-1.5-5.4,1-7.8\n\t\t\t\tc0.9-0.9,2.4-1.4,4.3-1.4c1.8,0,3.4,0.4,3.5,0.5c0.2,0,0.3,0.2,0.3,0.3c0.1,0.2,1.5,5.4-1,7.8C714.1,14,712.6,14.5,710.7,14.5z\n\t\t\t\t M707.7,13.2c0.5,0.1,1.7,0.4,3,0.4c1.7,0,2.9-0.4,3.7-1.2c1.8-1.8,1-5.7,0.8-6.7c-0.5-0.1-1.7-0.4-3-0.4c-1.7,0-2.9,0.4-3.7,1.2\n\t\t\t\tC706.7,8.3,707.4,12.2,707.7,13.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M719.5,17.7h-15.9c-0.3,0-0.5-0.2-0.5-0.5V1.3c0-0.3,0.2-0.5,0.5-0.5h15.9c0.3,0,0.5,0.2,0.5,0.5v15.9\n\t\t\tC719.9,17.5,719.7,17.7,719.5,17.7z M704,16.8h15v-15h-15V16.8z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g></g>\n<g>\n<path d='M711.2,317c-2.7,0-4.7-0.7-6-2c-3.4-3.4-1.4-10.4-1.4-10.7c0.1-0.3,0.3-0.5,0.6-0.6\n\t\t\t\tc0.1,0,2.3-0.6,4.7-0.6c2.6,0,4.7,0.7,6,2c3.4,3.4,1.4,10.4,1.4,10.7c-0.1,0.3-0.3,0.5-0.6,0.6C715.9,316.4,713.7,317,711.2,317z\n\t\t\t\t M705.5,305.3c-0.3,1.6-1.2,6.3,1,8.4c1,1,2.5,1.4,4.7,1.4c1.6,0,3-0.3,3.7-0.4c0.3-1.6,1.2-6.3-1-8.4c-1-1-2.5-1.4-4.7-1.4\n\t\t\t\tC707.7,304.9,706.3,305.2,705.5,305.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M716.4,319.2c-1.3,0-2.4-0.3-3-1c-1.7-1.7-0.7-5.3-0.7-5.4c0-0.2,0.2-0.3,0.3-0.3c0,0,1.1-0.3,2.4-0.3\n\t\t\t\tc1.3,0,2.4,0.3,3,1c1.7,1.7,0.7,5.3,0.7,5.4c0,0.2-0.2,0.3-0.3,0.3C718.7,318.9,717.6,319.2,716.4,319.2z M713.5,313.3\n\t\t\t\tc-0.2,0.8-0.6,3.2,0.5,4.3c0.6,0.6,1.6,0.7,2.4,0.7c0.8,0,1.5-0.1,1.9-0.2c0.2-0.8,0.6-3.2-0.5-4.3c-0.5-0.5-1.3-0.7-2.4-0.7\n\t\t\t\tC714.6,313.1,713.9,313.2,713.5,313.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M712,316.1c-1.9,0-3.4-0.5-4.3-1.4c-2.4-2.4-1-7.6-1-7.8c0-0.2,0.2-0.3,0.3-0.3c0.1,0,1.7-0.5,3.5-0.5\n\t\t\t\tc1.9,0,3.4,0.5,4.3,1.4c2.4,2.4,1,7.6,1,7.8c0,0.2-0.2,0.3-0.3,0.3C715.4,315.7,713.8,316.1,712,316.1z M707.5,307.3\n\t\t\t\tc-0.2,1-1,4.9,0.8,6.7c0.8,0.8,2,1.2,3.7,1.2c1.3,0,2.5-0.2,3-0.4c0.2-1,1-4.9-0.8-6.7c-0.8-0.8-2-1.2-3.7-1.2\n\t\t\t\tC709.2,307,708,307.2,707.5,307.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M719.5,319.6h-15.9c-0.3,0-0.5-0.2-0.5-0.5v-15.9c0-0.3,0.2-0.5,0.5-0.5h15.9c0.3,0,0.5,0.2,0.5,0.5v15.9\n\t\t\tC719.9,319.4,719.7,319.6,719.5,319.6z M704,318.7h15v-15h-15V318.7z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M9,316.6c-2.5,0-4.6-0.6-4.7-0.6c-0.3-0.1-0.5-0.3-0.6-0.6c-0.1-0.3-2-7.3,1.4-10.7c1.3-1.3,3.3-2,6-2\n\t\t\tc2.5,0,4.6,0.6,4.7,0.6c0.3,0.1,0.5,0.3,0.6,0.6c0.1,0.3,2,7.3-1.4,10.7C13.7,315.9,11.7,316.6,9,316.6z M5.3,314.3\n\t\t\tc0.7,0.2,2.2,0.4,3.7,0.4c1.5,0,3.5-0.3,4.7-1.4c2.2-2.2,1.4-6.9,1-8.4c-0.7-0.2-2.2-0.4-3.7-0.4c-1.5,0-3.5,0.2-4.7,1.4\n\t\t\tC4.1,308.1,5,312.8,5.3,314.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M3.9,318.8c-1.3,0-2.3-0.3-2.4-0.3c-0.2,0-0.3-0.2-0.3-0.3c0-0.1-1-3.7,0.7-5.4c0.7-0.7,1.7-1,3-1\n\t\t\tc1.3,0,2.3,0.3,2.4,0.3c0.2,0,0.3,0.2,0.3,0.3c0,0.1,1,3.7-0.7,5.4C6.2,318.4,5.2,318.8,3.9,318.8z M2,317.6\n\t\t\tc0.4,0.1,1.1,0.2,1.9,0.2c0.7,0,1.8-0.1,2.4-0.7c1-1,0.8-3.2,0.5-4.3c-0.4-0.1-1.1-0.2-1.9-0.2c-0.7,0-1.8,0.1-2.4,0.7\n\t\t\tC1.5,314.4,1.7,316.6,2,317.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M8.3,315.6c-1.8,0-3.4-0.4-3.5-0.5c-0.2,0-0.3-0.2-0.3-0.3c-0.1-0.2-1.5-5.4,1-7.8\n\t\t\tc0.9-0.9,2.4-1.4,4.3-1.4c1.8,0,3.4,0.4,3.5,0.5c0.2,0,0.3,0.2,0.3,0.3c0.1,0.2,1.5,5.4-1,7.8C11.7,315.1,10.2,315.6,8.3,315.6z\n\t\t\t M5.3,314.3c0.5,0.1,1.7,0.4,3,0.4c1.7,0,2.9-0.4,3.7-1.2c1.8-1.8,1-5.7,0.8-6.7c-0.5-0.1-1.7-0.4-3-0.4c-1.7,0-2.9,0.4-3.7,1.2\n\t\t\tC4.3,309.4,5,313.3,5.3,314.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M16.9,319.3H1c-0.3,0-0.5-0.2-0.5-0.5v-15.9c0-0.3,0.2-0.5,0.5-0.5h15.9c0.3,0,0.5,0.2,0.5,0.5v15.9\n\t\tC17.3,319.1,17.1,319.3,16.9,319.3z M1.4,318.4h15v-15h-15V318.4z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g></g>\n<rect fill='#FFEDF5' height='12.9' width='101' x='97.7' y='133.1'></rect>\n<g></g>\n<rect fill='#FFEDF5' height='12.9' width='63.1' x='97.7' y='165.1'></rect>\n<g></g>\n<g></g>\n<rect fill='#FFEDF5' height='12.9' width='101' x='502' y='133.1'></rect>\n<g></g>\n<rect fill='#FFEDF5' height='12.9' width='63.1' x='540' y='165.1'></rect>\n<g>\n<path d='M382.3,226.9c-4,0-8-3-12.3-6.2c-4.1-3-8.3-6.1-12-6.1s-7.9,3.1-12,6.1c-4.8,3.6-9.3,6.9-13.7,6.1\n\t\tc-4.9-0.9-8.1-6.2-11.3-11.3c-2.5-4-5-8.2-8.1-9.4c-3.1-1.3-8.5-0.4-13.5,0.7c-3.3,0.7-6.4,1.4-9.2,1.4c-2.4,0-4.3-0.5-5.7-1.6\n\t\tc-4.3-3.2-4.3-9.8-4.3-16.1c0-4.6,0-8.9-1.6-11.5c-1.7-2.8-5.6-5.3-9.3-7.7c-5.4-3.4-11-6.9-11-12.1c0-5.2,5.6-8.7,11-12.1\n\t\tc3.7-2.4,7.6-4.8,9.3-7.7c1.6-2.6,1.6-6.9,1.6-11.5c0-6.3,0-12.9,4.3-16.1c1.4-1.1,3.3-1.6,5.7-1.6c2.8,0,5.9,0.7,9.2,1.4\n\t\tc5,1.1,10.4,2,13.5,0.7c3-1.2,5.6-5.4,8.1-9.4c3.2-5.1,6.4-10.4,11.3-11.3c4.3-0.8,8.9,2.5,13.6,6.1c4.1,3,8.3,6.1,12,6.1\n\t\tc3.7,0,7.9-3.1,12-6.1c4.8-3.6,9.3-6.9,13.6-6.1c4.9,0.9,8.1,6.2,11.3,11.3c2.5,4,5,8.2,8.1,9.4c3.1,1.3,8.5,0.4,13.5-0.7\n\t\tc3.3-0.7,6.4-1.4,9.2-1.4c2.4,0,4.3,0.5,5.7,1.6c4.3,3.2,4.3,9.8,4.3,16.1c0,4.6,0,8.9,1.6,11.5c1.7,2.8,5.6,5.3,9.3,7.7\n\t\tc5.4,3.4,11,6.9,11,12.1c0,5.2-5.6,8.7-11,12.1c-3.7,2.4-7.6,4.8-9.3,7.7c-1.6,2.6-1.6,6.9-1.6,11.5c0,6.3,0,12.9-4.3,16.1\n\t\tc-1.4,1.1-3.3,1.6-5.7,1.6c-2.8,0-5.9-0.7-9.2-1.4c-5-1.1-10.4-2-13.5-0.7c-3,1.2-5.6,5.4-8.1,9.4c-3.2,5.1-6.4,10.4-11.3,11.3\n\t\tC383.2,226.8,382.7,226.9,382.3,226.9z M358,212.7c4.3,0,8.8,3.3,13.1,6.5c4.2,3.2,8.6,6.4,12.2,5.8c4.1-0.7,7.1-5.7,10.1-10.5\n\t\tc2.8-4.5,5.4-8.7,8.9-10.1c3.6-1.5,9.3-0.5,14.6,0.6c3.2,0.7,6.2,1.3,8.8,1.3c2,0,3.5-0.4,4.6-1.2c3.5-2.7,3.6-8.8,3.6-14.7\n\t\tc0-4.8,0-9.3,1.8-12.4c1.9-3.2,6-5.8,9.9-8.3c5-3.2,10.1-6.4,10.1-10.6c0-4.2-5.1-7.4-10.1-10.6c-3.9-2.5-8-5-9.9-8.3\n\t\tc-1.8-3-1.8-7.6-1.8-12.4c0-5.9,0-12-3.6-14.7c-1.1-0.8-2.6-1.2-4.6-1.2c-2.6,0-5.6,0.7-8.8,1.3c-5.3,1.1-11,2.1-14.6,0.6\n\t\tc-3.6-1.5-6.2-5.7-8.9-10.1c-3-4.8-6-9.7-10.1-10.5c-3.6-0.7-8,2.6-12.2,5.8c-4.3,3.2-8.7,6.5-13.1,6.5s-8.8-3.3-13.1-6.5\n\t\tc-4.3-3.2-8.6-6.4-12.2-5.8c-4.1,0.8-7.1,5.7-10.1,10.5c-2.8,4.5-5.4,8.7-8.9,10.1c-3.6,1.5-9.3,0.5-14.6-0.6\n\t\tc-3.2-0.7-6.2-1.3-8.8-1.3c-2,0-3.5,0.4-4.6,1.2c-3.5,2.7-3.6,8.8-3.6,14.7c0,4.8,0,9.4-1.8,12.4c-1.9,3.2-6,5.8-9.9,8.3\n\t\tc-5,3.2-10.1,6.4-10.1,10.6c0,4.2,5.1,7.4,10.1,10.6c3.9,2.5,8,5,9.9,8.3c1.8,3,1.8,7.6,1.8,12.4c0,5.9,0,12,3.6,14.7\n\t\tc1.1,0.8,2.6,1.2,4.6,1.2c2.6,0,5.6-0.7,8.8-1.3c5.3-1.2,11-2.1,14.6-0.6c3.6,1.5,6.2,5.7,8.9,10.1c3,4.8,6,9.7,10.1,10.5\n\t\tc3.6,0.7,8-2.6,12.2-5.8C349.2,216,353.6,212.7,358,212.7z' fill='#FFEDF5'></path>\n</g>\n<g>\n<path d='M360,230.5c-4.6,0-8.6-4.4-12.4-8.7c-3.1-3.4-6.3-7-9.4-7.6c-3.5-0.6-8,1.5-12.4,3.6\n\t\tc-4,1.9-7.8,3.8-11.2,3.8c-1.1,0-2.1-0.2-3-0.6c-4.4-2-5.9-8-7.3-13.8c-1.1-4.3-2.2-8.8-4.5-10.8c-2.6-2.2-7.4-2.9-12-3.6\n\t\tc-5.8-0.8-11.7-1.7-13.8-5.7c-2.2-4.3,0.7-9.7,3.6-15c2.1-3.9,4.3-7.9,4.2-11.1c-0.1-3.2-2.4-7.1-4.7-10.8\n\t\tc-3.1-5.1-6.4-10.5-4.3-14.8c1.9-4.1,7.8-5.2,13.5-6.4c4.6-0.9,9.4-1.8,11.8-4.2c2.2-2.1,3.1-6.7,4-11.1c1.2-5.8,2.3-11.9,6.6-14.1\n\t\tc1-0.5,2.2-0.8,3.4-0.8c3.3,0,7,1.6,10.9,3.2c4.5,1.9,9.3,3.8,12.5,3c3.1-0.7,6.1-4.5,9-8.1c3.7-4.5,7.5-9.2,12.1-9.3c0,0,0,0,0,0\n\t\tc4.8,0,8.8,4.4,12.6,8.7c3.1,3.4,6.3,7,9.4,7.6c3.5,0.7,8-1.5,12.4-3.6c4-1.9,7.8-3.8,11.2-3.8c1.1,0,2.1,0.2,3,0.6\n\t\tc4.4,2,5.9,8,7.3,13.8c1.1,4.3,2.2,8.8,4.5,10.8c2.6,2.2,7.4,2.9,12,3.6c5.8,0.8,11.7,1.7,13.8,5.7c2.2,4.3-0.7,9.7-3.6,15\n\t\tc-2.1,3.9-4.3,7.9-4.2,11.1s2.4,7.1,4.7,10.8c3.1,5.1,6.4,10.5,4.3,14.8c-1.9,4.1-7.8,5.2-13.5,6.4c-4.6,0.9-9.4,1.8-11.8,4.2\n\t\tc-2.2,2.1-3.1,6.7-4,11c-1.2,5.8-2.3,11.9-6.6,14.1c-1,0.5-2.1,0.8-3.4,0.8c-3.3,0-7-1.6-10.9-3.2c-4.5-1.9-9.3-3.8-12.5-3\n\t\tc-3.1,0.7-6.1,4.5-9,8.1c-3.7,4.5-7.5,9.2-12.1,9.3L360,230.5z M336.8,212.3c0.6,0,1.2,0.1,1.7,0.2c3.7,0.7,6.9,4.3,10.4,8.2\n\t\tc3.6,4,7.3,8.1,11.1,8.1v0.9l0.1-0.9c3.8-0.1,7.4-4.4,10.8-8.7c3.2-4,6.3-7.8,10-8.7c0.7-0.2,1.4-0.2,2.2-0.2\n\t\tc3.5,0,7.6,1.7,11.5,3.3c3.6,1.5,7.3,3.1,10.2,3.1c1,0,1.9-0.2,2.6-0.6c3.5-1.8,4.6-7.4,5.7-12.8c1-4.9,1.9-9.5,4.5-12\n\t\tc2.8-2.7,7.9-3.7,12.7-4.6c5.3-1,10.7-2.1,12.2-5.3c1.6-3.5-1.4-8.4-4.2-13.1c-2.4-4-4.9-8.1-5-11.7c-0.1-3.7,2.2-7.9,4.4-12\n\t\tc2.6-4.9,5.4-9.9,3.6-13.3c-1.7-3.2-7.2-4-12.5-4.7c-4.9-0.7-10-1.4-12.9-4c-2.7-2.4-3.9-6.9-5.1-11.8c-1.3-5.4-2.7-10.9-6.3-12.5\n\t\tc-2.9-1.3-7.9,0.9-12.7,3.1c-4,1.9-8.2,3.9-11.8,3.9c-0.6,0-1.2-0.1-1.7-0.2c-3.7-0.7-6.9-4.3-10.4-8.2c-3.6-4-7.3-8.1-11.1-8.1\n\t\tc-4,0.1-7.5,4.4-10.9,8.7c-3.2,4-6.3,7.8-10,8.7c-0.7,0.2-1.4,0.3-2.2,0.3c-3.5,0-7.6-1.7-11.5-3.3c-3.6-1.5-7.3-3.1-10.2-3.1\n\t\tc-1,0-1.9,0.2-2.6,0.6c-3.5,1.8-4.6,7.4-5.7,12.8c-1,4.9-1.9,9.5-4.5,12c-2.8,2.7-7.9,3.7-12.7,4.6c-5.3,1-10.7,2.1-12.2,5.3\n\t\tc-1.6,3.5,1.4,8.4,4.2,13.1c2.4,4,4.9,8.1,5,11.7c0.1,3.7-2.2,7.9-4.4,12c-2.6,4.9-5.4,9.9-3.6,13.3c1.7,3.2,7.2,4,12.5,4.7\n\t\tc4.9,0.7,10,1.4,12.9,4c2.7,2.4,3.9,6.9,5.1,11.8c1.3,5.4,2.7,10.9,6.3,12.5c2.9,1.3,7.9-0.9,12.7-3.1\n\t\tC329,214.3,333.2,212.3,336.8,212.3z' fill='#FFEDF5'></path>\n</g>\n<g></g>\n<ellipse cx='358' cy='159.2' fill='#FFFFFF' rx='74' ry='47.5'>\n<path d='M358,208.5c-41.8,0-75.8-22.1-75.8-49.3s34-49.3,75.8-49.3s75.8,22.1,75.8,49.3S399.8,208.5,358,208.5z\n\t\t M358,113.5c-39.8,0-72.2,20.5-72.2,45.7s32.4,45.7,72.2,45.7c39.8,0,72.2-20.5,72.2-45.7S397.8,113.5,358,113.5z' fill='#FFEDF5'></path>\n</ellipse>\n<g></g>\n<g></g>\n<g>\n<path d='M47.1,29.6C47.1,29.6,47.1,29.5,47.1,29.6c-0.2,0-0.3-0.2-0.3-0.3c2.1-15.1,5.3-22.1,10.1-22.1\n\t\t\t\tc4.8,0,8,7,10.1,22.1c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-2-14.6-5.1-21.6-9.5-21.6c-4.5,0-7.5,6.9-9.5,21.6\n\t\t\t\tC47.4,29.5,47.2,29.6,47.1,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M72.8,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.9-14-4.9-20.8-9.2-20.8c-4.3,0-7.2,6.6-9.2,20.8\n\t\t\t\tc0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3C55.7,14.7,58.8,8,63.4,8c4.7,0,7.7,6.8,9.7,21.3C73.1,29.4,73,29.5,72.8,29.6\n\t\t\t\tC72.9,29.5,72.8,29.6,72.8,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M40.9,29.6C40.9,29.6,40.9,29.5,40.9,29.6c-0.2,0-0.3-0.2-0.3-0.3C42.7,14.7,45.7,8,50.4,8\n\t\t\t\tc4.7,0,7.7,6.8,9.7,21.3c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.9-14-4.9-20.8-9.2-20.8c-4.3,0-7.2,6.6-9.2,20.8\n\t\t\t\tC41.2,29.5,41.1,29.6,40.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M61,29.6C61,29.6,61,29.5,61,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.4-10.4,3.5-16.4,6.4-18.3\n\t\t\t\tc1-0.7,2.1-0.9,3.4-0.6c4.8,1.1,8.1,7.7,9.6,19c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.5-11-4.7-17.4-9.2-18.5\n\t\t\t\tc-1.1-0.3-2-0.1-2.9,0.5c-2.8,1.9-4.8,7.8-6.2,18C61.3,29.5,61.2,29.6,61,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M33,29.6C33,29.6,32.9,29.5,33,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.7-12,3.8-19,9.7-19c3.4,0,8.1,7.2,9.7,19\n\t\t\t\tc0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.6-12.1-6.4-18.5-9.2-18.5c-5.5,0-7.5,6.8-9.2,18.5\n\t\t\t\tC33.2,29.5,33.1,29.6,33,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M85.9,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9.1-4.5-11.8-6.9-13.7l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3\n\t\t\t\tc-2.8,1.1-5.6,7.2-6.5,14.2c0,0.1-0.1,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.3,3.9-13.4,6.9-14.6c0.9-0.4,1.8-0.2,2.6,0.4\n\t\t\t\tl0.1,0.1c2.5,2,5.8,4.8,7.1,14.1C86.1,29.4,86,29.5,85.9,29.6C85.9,29.5,85.9,29.6,85.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M36.2,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.8-6.3-3.1-8.1-4.7-9.5l-0.1-0.1c-0.4-0.4-0.9-0.4-1.4-0.2\n\t\t\t\tc-1.9,0.7-3.8,4.9-4.5,9.8c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.7-5.1,2.7-9.4,4.8-10.2c0.7-0.3,1.3-0.2,1.9,0.3\n\t\t\t\tl0.1,0.1c1.7,1.4,4.1,3.3,4.9,9.8C36.4,29.4,36.3,29.5,36.2,29.6C36.2,29.5,36.2,29.6,36.2,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M90,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.6-4.4-2.2-5.7-3.3-6.7l-0.1,0c-0.3-0.2-0.6-0.3-0.9-0.1\n\t\t\t\tc-1.1,0.4-2.6,3-3.1,6.9c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.5-3.6,2-6.7,3.5-7.3c0.5-0.2,1-0.1,1.4,0.2l0.1,0.1\n\t\t\t\tc1.2,1,2.9,2.4,3.5,7C90.3,29.4,90.2,29.5,90,29.6C90,29.5,90,29.6,90,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M43.8,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9.1-4.5-11.8-6.9-13.7l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3\n\t\t\t\tc-2.8,1.1-5.6,7.2-6.5,14.2c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.3,3.9-13.4,6.9-14.6c0.9-0.4,1.8-0.2,2.6,0.4\n\t\t\t\tl0.1,0.1c2.5,2,5.8,4.8,7.1,14.1C44.1,29.4,44,29.5,43.8,29.6C43.8,29.5,43.8,29.6,43.8,29.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M114.8,29.6C114.8,29.6,114.8,29.5,114.8,29.6c-0.2,0-0.3-0.2-0.3-0.3c2.1-15.1,5.3-22.1,10.1-22.1\n\t\t\t\tc4.8,0,8.1,7.2,10.1,22.1c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-2-14.6-5.1-21.6-9.5-21.6c-4.5,0-7.5,6.9-9.5,21.6\n\t\t\t\tC115.1,29.5,115,29.6,114.8,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M121.7,29.6C121.7,29.6,121.7,29.5,121.7,29.6c-0.2,0-0.3-0.2-0.3-0.3c2-14.5,5.1-21.3,9.7-21.3\n\t\t\t\tc4.7,0,7.7,6.8,9.7,21.3c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.9-14-4.9-20.8-9.2-20.8c-4.3,0-7.2,6.6-9.2,20.8\n\t\t\t\tC122,29.5,121.9,29.6,121.7,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M108.7,29.6C108.7,29.6,108.7,29.5,108.7,29.6c-0.2,0-0.3-0.2-0.3-0.3c2-14.5,5.1-21.3,9.7-21.3\n\t\t\t\tc4.7,0,7.7,6.8,9.7,21.3c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.9-14-4.9-20.8-9.2-20.8c-4.3,0-7.2,6.6-9.2,20.8\n\t\t\t\tC108.9,29.5,108.8,29.6,108.7,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M147.6,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.5-11-4.7-17.4-9.2-18.5c-1.1-0.3-2-0.1-2.9,0.5\n\t\t\t\tc-2.8,1.9-4.8,7.8-6.2,18c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.4-10.4,3.5-16.4,6.4-18.3c1-0.7,2.1-0.9,3.4-0.6\n\t\t\t\tc4.8,1.1,8.1,7.7,9.6,19C147.9,29.4,147.8,29.5,147.6,29.6C147.6,29.5,147.6,29.6,147.6,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M119.6,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.6-12.1-6.4-18.5-9.2-18.5c-5.5,0-7.5,6.8-9.2,18.5\n\t\t\t\tc0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.7-12,3.8-19,9.7-19c3.4,0,8.1,7.2,9.7,19C119.9,29.4,119.7,29.5,119.6,29.6\n\t\t\t\tC119.6,29.5,119.6,29.6,119.6,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M153.6,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9.1-4.5-11.8-6.9-13.7l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3\n\t\t\t\tc-2.8,1.1-5.6,7.2-6.5,14.2c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.3,3.9-13.4,6.9-14.6c0.9-0.4,1.8-0.2,2.6,0.4\n\t\t\t\tl0.1,0.1c2.5,2,5.8,4.8,7.1,14.1C153.9,29.4,153.8,29.5,153.6,29.6C153.6,29.5,153.6,29.6,153.6,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M103.9,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.8-6.3-3.1-8.1-4.7-9.5l-0.1-0.1c-0.4-0.4-0.9-0.4-1.4-0.2\n\t\t\t\tc-1.9,0.7-3.8,4.9-4.5,9.8c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.7-5.1,2.7-9.4,4.8-10.2c0.7-0.3,1.3-0.2,1.9,0.3\n\t\t\t\tl0.1,0.1c1.7,1.4,4.1,3.3,4.9,9.8C104.2,29.4,104.1,29.5,103.9,29.6C103.9,29.5,103.9,29.6,103.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M157.7,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.6-4.4-2.2-5.7-3.3-6.7l-0.1,0c-0.3-0.2-0.6-0.3-0.9-0.1\n\t\t\t\tc-1.1,0.4-2.6,3-3.1,6.9c0,0.1-0.1,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.5-3.6,2-6.7,3.5-7.3c0.5-0.2,1-0.1,1.4,0.2l0.1,0\n\t\t\t\tc1.2,1,2.9,2.4,3.5,7C158,29.4,157.9,29.5,157.7,29.6C157.8,29.5,157.8,29.6,157.7,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M111.6,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9.1-4.5-11.8-6.9-13.7l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3\n\t\t\t\tc-2.8,1.1-5.6,7.2-6.5,14.2c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.3,3.9-13.4,6.9-14.6c0.9-0.4,1.8-0.2,2.6,0.4\n\t\t\t\tl0.1,0.1c2.5,2,5.8,4.8,7.1,14.1C111.8,29.4,111.7,29.5,111.6,29.6C111.6,29.5,111.6,29.6,111.6,29.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M182.6,29.6C182.6,29.6,182.6,29.5,182.6,29.6c-0.2,0-0.3-0.2-0.3-0.3c2.1-15.1,5.3-22.1,10.1-22.1\n\t\t\t\tc4.8,0,8,7,10.1,22.1c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-2-14.6-5.1-21.6-9.5-21.6c-4.5,0-7.5,6.9-9.5,21.6\n\t\t\t\tC182.8,29.5,182.7,29.6,182.6,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M208.3,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.9-14-4.9-20.8-9.2-20.8c-4.3,0-7.2,6.6-9.2,20.8\n\t\t\t\tc0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c2-14.5,5.1-21.3,9.7-21.3c4.7,0,7.7,6.8,9.7,21.3\n\t\t\t\tC208.6,29.4,208.5,29.5,208.3,29.6C208.3,29.5,208.3,29.6,208.3,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M176.4,29.6C176.4,29.6,176.4,29.5,176.4,29.6c-0.2,0-0.3-0.2-0.3-0.3c2-14.5,5.1-21.3,9.7-21.3\n\t\t\t\tc4.7,0,7.7,6.8,9.7,21.3c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.9-14-4.9-20.8-9.2-20.8c-4.3,0-7.2,6.6-9.2,20.8\n\t\t\t\tC176.7,29.5,176.6,29.6,176.4,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M196.5,29.6C196.5,29.6,196.5,29.5,196.5,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.4-10.4,3.5-16.4,6.4-18.3\n\t\t\t\tc1-0.7,2.1-0.9,3.4-0.6c4.8,1.1,8.1,7.7,9.6,19c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.5-11-4.7-17.4-9.2-18.5\n\t\t\t\tc-1.1-0.3-2-0.1-2.9,0.5c-2.8,1.9-4.8,7.8-6.2,18C196.8,29.5,196.6,29.6,196.5,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M168.5,29.6C168.4,29.6,168.4,29.5,168.5,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.7-12,3.8-19,9.7-19\n\t\t\t\tc3.4,0,8.1,7.2,9.7,19c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.6-12.1-6.4-18.5-9.2-18.5c-5.5,0-7.5,6.8-9.2,18.5\n\t\t\t\tC168.7,29.5,168.6,29.6,168.5,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M221.3,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9.1-4.5-11.8-6.9-13.7l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3\n\t\t\t\tc-2.8,1.1-5.6,7.2-6.5,14.2c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.3,3.9-13.4,6.9-14.6c0.9-0.4,1.8-0.2,2.6,0.4\n\t\t\t\tl0.1,0.1c2.5,2,5.8,4.8,7.1,14.1C221.6,29.4,221.5,29.5,221.3,29.6C221.4,29.5,221.4,29.6,221.3,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M171.6,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.8-6.3-3.1-8.1-4.7-9.5l-0.1-0.1c-0.4-0.4-0.9-0.4-1.4-0.2\n\t\t\t\tc-1.9,0.7-3.8,4.9-4.5,9.8c0,0.1-0.1,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.7-5.1,2.7-9.4,4.8-10.2c0.7-0.3,1.3-0.2,1.9,0.3\n\t\t\t\tl0.1,0.1c1.7,1.4,4.1,3.3,4.9,9.8C171.9,29.4,171.8,29.5,171.6,29.6C171.7,29.5,171.7,29.6,171.6,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M225.5,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.6-4.4-2.2-5.7-3.3-6.7l-0.1,0c-0.3-0.2-0.6-0.3-0.9-0.1\n\t\t\t\tc-1.1,0.4-2.6,3-3.1,6.9c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.5-3.6,2-6.7,3.5-7.3c0.5-0.2,1-0.1,1.4,0.2l0.1,0.1\n\t\t\t\tc1.2,1,2.9,2.4,3.5,7C225.8,29.4,225.7,29.5,225.5,29.6C225.5,29.5,225.5,29.6,225.5,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M179.3,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9.1-4.5-11.8-6.9-13.7l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3\n\t\t\t\tc-2.8,1.1-5.6,7.2-6.5,14.2c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.3,3.9-13.4,6.9-14.6c0.9-0.4,1.8-0.2,2.6,0.4\n\t\t\t\tl0.1,0.1c2.5,2,5.8,4.8,7.1,14.1C179.6,29.4,179.5,29.5,179.3,29.6C179.3,29.5,179.3,29.6,179.3,29.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M266.9,29.6c-0.1,0-0.3-0.1-0.3-0.2C264.8,15,261.7,8,257.4,8c-4.3,0-7.3,6.8-9.3,21.3\n\t\t\t\tc0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c2-14.9,5.1-21.8,9.8-21.8c4.7,0,7.8,6.9,9.8,21.8\n\t\t\t\tC267.2,29.4,267.1,29.5,266.9,29.6C266.9,29.5,266.9,29.6,266.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M272.9,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.8-13.8-4.7-20.5-8.9-20.5c-4.2,0-7,6.5-8.9,20.5\n\t\t\t\tc0,0.1-0.1,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.9-14.3,4.9-21,9.4-21c4.5,0,7.5,6.7,9.4,21C273.2,29.4,273.1,29.5,272.9,29.6\n\t\t\t\tC272.9,29.5,272.9,29.6,272.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M260.2,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.8-13.8-4.7-20.5-8.9-20.5c-4.2,0-7,6.5-8.9,20.5\n\t\t\t\tc0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.9-14.3,4.9-21,9.4-21c4.5,0,7.5,6.7,9.4,21C260.5,29.4,260.4,29.5,260.2,29.6\n\t\t\t\tC260.2,29.5,260.2,29.6,260.2,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M279.7,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.4-10.9-4.5-17.2-9-18.2c-1-0.2-1.9-0.1-2.8,0.5\n\t\t\t\tc-2.7,1.8-4.7,7.6-6,17.7c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.4-10.2,3.4-16.1,6.3-18.1c1-0.7,2.1-0.9,3.2-0.6\n\t\t\t\tc4.7,1.1,7.9,7.6,9.4,18.7C280,29.4,279.9,29.5,279.7,29.6C279.8,29.5,279.8,29.6,279.7,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M252.5,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.6-11.9-6.2-18.2-8.9-18.2c-5.4,0-7.3,6.7-8.9,18.2\n\t\t\t\tc0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.6-11.8,3.7-18.7,9.4-18.7c3.3,0,7.9,7.1,9.4,18.7\n\t\t\t\tC252.8,29.4,252.7,29.5,252.5,29.6C252.5,29.5,252.5,29.6,252.5,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M269.8,29.6C269.8,29.6,269.8,29.5,269.8,29.6c-0.2,0-0.3-0.2-0.3-0.3c1-7.2,3.8-13.3,6.7-14.4\n\t\t\t\tc0.9-0.4,1.8-0.2,2.6,0.4l0.1,0.1c2.4,2,5.7,4.7,6.9,13.9c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2\n\t\t\t\tc-1.2-9-4.4-11.6-6.7-13.5l-0.1-0.1c-0.6-0.5-1.3-0.6-2-0.3c-2.7,1-5.4,7.1-6.4,14C270.1,29.5,270,29.6,269.8,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M237.2,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.8-6.2-3-8-4.6-9.3l-0.1-0.1c-0.4-0.3-0.8-0.4-1.3-0.2\n\t\t\t\tc-1.8,0.7-3.7,4.9-4.4,9.6c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.7-5,2.7-9.3,4.7-10c0.7-0.3,1.3-0.2,1.9,0.3l0.1,0.1\n\t\t\t\tc1.7,1.4,4,3.3,4.8,9.7C237.5,29.4,237.4,29.5,237.2,29.6C237.3,29.5,237.3,29.6,237.2,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M289.6,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.6-4.4-2.1-5.6-3.2-6.6l-0.1,0c-0.3-0.2-0.5-0.3-0.8-0.1\n\t\t\t\tc-1.1,0.4-2.5,2.9-3,6.8c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.5-3.6,1.9-6.6,3.4-7.2c0.5-0.2,1-0.1,1.4,0.2l0.1,0\n\t\t\t\tc1.2,1,2.8,2.3,3.4,6.9C289.9,29.4,289.8,29.5,289.6,29.6C289.6,29.5,289.6,29.6,289.6,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M229,29.6C228.9,29.6,228.9,29.5,229,29.6c-0.2,0-0.3-0.2-0.3-0.3c1-7.2,3.8-13.3,6.7-14.4\n\t\t\t\tc0.9-0.4,1.8-0.2,2.6,0.4l0.1,0.1c2.4,2,5.7,4.7,6.9,13.9c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2\n\t\t\t\tc-1.2-9-4.4-11.6-6.7-13.5l-0.1-0.1c-0.6-0.5-1.3-0.6-2-0.3c-2.7,1-5.4,7.1-6.4,14C229.2,29.5,229.1,29.6,229,29.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M333.9,29.6c-0.1,0-0.3-0.1-0.3-0.2C331.7,15,328.7,8,324.3,8c-4.4,0-7.4,6.8-9.4,21.3\n\t\t\t\tc0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c2-14.9,5.2-21.8,9.9-21.8c4.8,0,7.9,6.9,9.9,21.8\n\t\t\t\tC334.2,29.4,334.1,29.5,333.9,29.6C334,29.5,333.9,29.6,333.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M340,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.9-13.8-4.8-20.5-9-20.5c-4.2,0-7.1,6.5-9,20.5\n\t\t\t\tc0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c2-14.3,5-21,9.6-21c4.6,0,7.6,6.7,9.6,21C340.3,29.4,340.2,29.5,340,29.6\n\t\t\t\tC340,29.5,340,29.6,340,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M327.1,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.9-13.8-4.8-20.5-9-20.5c-4.2,0-7.1,6.5-9,20.5\n\t\t\t\tc0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c2-14.3,5-21,9.6-21c4.6,0,7.6,6.7,9.6,21C327.4,29.4,327.3,29.5,327.1,29.6\n\t\t\t\tC327.2,29.5,327.2,29.6,327.1,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M328.4,29.6C328.3,29.6,328.3,29.5,328.4,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.4-10.2,3.5-16.1,6.3-18.1\n\t\t\t\tc1-0.7,2.1-0.9,3.3-0.6c4.7,1.1,8,7.6,9.5,18.7c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.5-10.9-4.6-17.2-9.1-18.2\n\t\t\t\tc-1-0.2-2-0.1-2.9,0.5c-2.7,1.9-4.7,7.6-6.1,17.7C328.6,29.5,328.5,29.6,328.4,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M319.3,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.6-11.9-6.3-18.2-9-18.2c-5.4,0-7.4,6.7-9,18.2\n\t\t\t\tc0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.6-11.8,3.7-18.7,9.6-18.7c3.4,0,8,7.1,9.6,18.7\n\t\t\t\tC319.6,29.4,319.5,29.5,319.3,29.6C319.3,29.5,319.3,29.6,319.3,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M352.8,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9-4.4-11.6-6.8-13.5l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3\n\t\t\t\tc-2.7,1.1-5.5,7.1-6.4,14c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.2,3.8-13.2,6.8-14.4c0.9-0.4,1.8-0.2,2.6,0.4\n\t\t\t\tl0.1,0.1c2.4,2,5.7,4.7,7,13.9C353.1,29.4,353,29.5,352.8,29.6C352.8,29.5,352.8,29.6,352.8,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M303.9,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.8-6.2-3.1-8-4.7-9.3l-0.1-0.1c-0.4-0.3-0.8-0.4-1.3-0.2\n\t\t\t\tc-1.9,0.7-3.8,4.9-4.4,9.6c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.7-5,2.7-9.2,4.7-10c0.7-0.3,1.3-0.2,1.9,0.3l0.1,0.1\n\t\t\t\tc1.7,1.4,4,3.3,4.9,9.7C304.2,29.4,304.1,29.5,303.9,29.6C303.9,29.5,303.9,29.6,303.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M356.9,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.6-4.4-2.1-5.6-3.3-6.6l-0.1,0c-0.3-0.2-0.6-0.3-0.9-0.1\n\t\t\t\tc-1.1,0.4-2.6,2.9-3.1,6.8c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.5-3.6,1.9-6.6,3.4-7.2c0.5-0.2,1-0.1,1.4,0.2l0.1,0.1\n\t\t\t\tc1.2,1,2.9,2.3,3.5,6.9C357.2,29.4,357.1,29.5,356.9,29.6C356.9,29.5,356.9,29.6,356.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M311.4,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9-4.4-11.6-6.8-13.5l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3\n\t\t\t\tc-2.7,1.1-5.5,7.1-6.4,14c0,0.1-0.2,0.3-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.2,3.8-13.2,6.8-14.4c0.9-0.4,1.8-0.2,2.6,0.4\n\t\t\t\tl0.1,0.1c2.4,2,5.7,4.7,7,13.9C311.7,29.4,311.6,29.5,311.4,29.6C311.4,29.5,311.4,29.6,311.4,29.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M381.7,29.6C381.7,29.6,381.7,29.5,381.7,29.6c-0.2,0-0.3-0.2-0.3-0.3c2-14.6,5.2-21.4,9.9-21.4\n\t\t\t\tc4.7,0,7.9,7,9.9,21.4c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.9-14.1-5-20.9-9.3-20.9c-4.4,0-7.3,6.6-9.3,20.9\n\t\t\t\tC382,29.5,381.9,29.6,381.7,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M388.5,29.6C388.5,29.6,388.4,29.5,388.5,29.6c-0.2,0-0.3-0.2-0.3-0.3c2-14.2,4.9-20.6,9.5-20.6\n\t\t\t\tc4.6,0,7.6,6.5,9.5,20.6c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.8-13.5-4.8-20.1-9-20.1c-4.2,0-7.1,6.4-9,20.1\n\t\t\t\tC388.7,29.5,388.6,29.6,388.5,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M394.2,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.8-13.5-4.8-20.1-9-20.1c-4.2,0-7.1,6.4-9,20.1\n\t\t\t\tc0,0.1-0.1,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c2-14.1,5-20.6,9.5-20.6c4.6,0,7.6,6.5,9.5,20.6C394.5,29.4,394.3,29.5,394.2,29.6\n\t\t\t\tC394.2,29.5,394.2,29.6,394.2,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M413.8,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.4-10.7-4.6-16.8-9-17.9c-1.1-0.3-2-0.1-2.9,0.5\n\t\t\t\tc-2.7,1.8-4.6,7.5-6,17.3c0,0.1-0.1,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.4-10,3.4-15.8,6.3-17.7c1-0.7,2.1-0.9,3.3-0.6\n\t\t\t\tc4.7,1.1,8,7.4,9.4,18.3C414.1,29.4,414,29.5,413.8,29.6C413.9,29.5,413.8,29.6,413.8,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M386.3,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.6-11.7-6.2-17.9-9-17.9c-5.4,0-7.4,6.6-9,17.9\n\t\t\t\tc0,0.1-0.1,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.6-11.6,3.7-18.3,9.5-18.3c3.4,0,8,7,9.5,18.3C386.6,29.4,386.5,29.5,386.3,29.6\n\t\t\t\tC386.4,29.5,386.4,29.6,386.3,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M403.9,29.6C403.8,29.6,403.8,29.5,403.9,29.6c-0.2,0-0.3-0.2-0.3-0.3c1-7,3.8-13,6.7-14.1\n\t\t\t\tc0.9-0.4,1.8-0.2,2.6,0.4l0.1,0.1c2.4,1.9,5.7,4.6,6.9,13.6c0,0.1-0.1,0.3-0.2,0.3c-0.2,0-0.3-0.1-0.3-0.2\n\t\t\t\tc-1.2-8.8-4.4-11.4-6.7-13.3l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3c-2.7,1.1-5.4,7-6.4,13.7C404.1,29.5,404,29.6,403.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M360,29.6C360,29.6,360,29.5,360,29.6c-0.2,0-0.3-0.2-0.3-0.3c0.7-4.9,2.7-9.1,4.7-9.9\n\t\t\t\tc0.7-0.3,1.3-0.2,1.9,0.3l0.1,0.1c1.7,1.4,4,3.2,4.8,9.5c0,0.1-0.1,0.3-0.2,0.3c-0.2,0-0.3-0.1-0.3-0.2c-0.8-6.1-3-7.9-4.6-9.2\n\t\t\t\tl-0.1-0.1c-0.4-0.3-0.9-0.4-1.3-0.2c-1.8,0.7-3.7,4.8-4.4,9.4C360.3,29.5,360.1,29.6,360,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M423.8,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.6-4.3-2.1-5.5-3.3-6.4l-0.1,0c-0.3-0.2-0.6-0.3-0.9-0.1\n\t\t\t\tc-1.1,0.4-2.5,2.9-3.1,6.6c0,0.1-0.1,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.5-3.5,1.9-6.5,3.4-7.1c0.5-0.2,1-0.1,1.4,0.2l0.1,0\n\t\t\t\tc1.2,1,2.9,2.3,3.5,6.8C424,29.4,423.9,29.5,423.8,29.6C423.8,29.5,423.8,29.6,423.8,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M362.7,29.6C362.6,29.6,362.6,29.5,362.7,29.6c-0.2,0-0.3-0.2-0.3-0.3c1-7,3.8-13,6.7-14.1\n\t\t\t\tc0.9-0.4,1.8-0.2,2.6,0.4l0.1,0.1c2.4,1.9,5.7,4.6,6.9,13.6c0,0.1-0.1,0.3-0.2,0.3c-0.2,0-0.3-0.1-0.3-0.2\n\t\t\t\tc-1.2-8.8-4.4-11.4-6.7-13.3l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3c-2.7,1.1-5.4,7-6.4,13.7C362.9,29.5,362.8,29.6,362.7,29.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M448.9,29.6C448.9,29.6,448.9,29.5,448.9,29.6c-0.2,0-0.3-0.2-0.3-0.3c2-15.1,5-21.8,9.6-21.8\n\t\t\t\tc4.6,0,7.7,6.9,9.6,21.8c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2C465.5,14.9,462.6,8,458.3,8c-4.3,0-7.2,6.8-9.1,21.4\n\t\t\t\tC449.2,29.4,449.1,29.6,448.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M455.5,29.6C455.5,29.6,455.5,29.5,455.5,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.9-14.5,4.8-21,9.3-21\n\t\t\t\tc4.5,0,7.4,6.7,9.3,21c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.8-13.8-4.7-20.5-8.7-20.5c-4.1,0-6.9,6.5-8.7,20.5\n\t\t\t\tC455.8,29.4,455.7,29.6,455.5,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M461.1,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.8-13.8-4.7-20.5-8.7-20.5c-4.1,0-6.9,6.5-8.7,20.5\n\t\t\t\tc0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.9-14.5,4.8-21,9.3-21c4.5,0,7.4,6.7,9.3,21C461.4,29.4,461.3,29.5,461.1,29.6\n\t\t\t\tC461.1,29.5,461.1,29.6,461.1,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M480.3,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.4-10.9-4.5-17.2-8.8-18.3c-1-0.2-1.9-0.1-2.7,0.5\n\t\t\t\tc-2.7,1.8-4.6,7.6-6,17.8c0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.4-10.3,3.4-16.2,6.2-18.2c1-0.7,2-0.8,3.2-0.6\n\t\t\t\tc4.6,1.1,7.8,7.6,9.2,18.7C480.6,29.4,480.5,29.5,480.3,29.6C480.3,29.5,480.3,29.6,480.3,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M453.5,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.5-11.9-6.1-18.3-8.7-18.3c-5.3,0-7.2,6.7-8.7,18.3\n\t\t\t\tc0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.6-11.9,3.6-18.7,9.3-18.7c3.3,0,7.8,7.2,9.3,18.7\n\t\t\t\tC453.7,29.4,453.6,29.5,453.5,29.6C453.5,29.5,453.5,29.6,453.5,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M486,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9-4.3-11.6-6.6-13.6l-0.1-0.1c-0.6-0.5-1.2-0.6-1.9-0.4\n\t\t\t\tc-2.7,1-5.4,7-6.3,14c0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.3,3.8-13.3,6.6-14.5c0.9-0.3,1.7-0.2,2.5,0.4l0.1,0.1\n\t\t\t\tc2.4,2,5.6,4.7,6.8,13.9C486.3,29.4,486.2,29.5,486,29.6C486,29.5,486,29.6,486,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M438.5,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.8-6.2-3-8-4.5-9.4l-0.1-0.1c-0.4-0.3-0.8-0.4-1.3-0.2\n\t\t\t\tc-1.8,0.7-3.7,4.8-4.3,9.7c0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.7-5.1,2.6-9.3,4.6-10.1c0.6-0.2,1.3-0.1,1.8,0.3\n\t\t\t\tl0.1,0.1c1.6,1.4,3.9,3.3,4.7,9.7C438.8,29.4,438.7,29.5,438.5,29.6C438.5,29.5,438.5,29.6,438.5,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M490,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.6-4.4-2.1-5.7-3.2-6.6l-0.1,0c-0.3-0.2-0.5-0.3-0.8-0.1\n\t\t\t\tc-1.1,0.4-2.5,3.1-3,6.8c0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.5-3.6,1.9-6.7,3.3-7.2c0.5-0.2,1-0.1,1.4,0.2l0.1,0\n\t\t\t\tc1.2,1,2.8,2.4,3.4,6.9C490.3,29.4,490.1,29.5,490,29.6C490,29.5,490,29.6,490,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M445.8,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9-4.3-11.6-6.6-13.6l-0.1-0.1c-0.6-0.5-1.2-0.6-1.9-0.4\n\t\t\t\tc-2.7,1-5.4,7-6.3,14c0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.3,3.8-13.3,6.6-14.5c0.9-0.3,1.7-0.2,2.5,0.4l0.1,0.1\n\t\t\t\tc2.4,2,5.6,4.7,6.8,13.9C446.1,29.4,446,29.5,445.8,29.6C445.8,29.5,445.8,29.6,445.8,29.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M515.1,29.6C515.1,29.6,515.1,29.5,515.1,29.6c-0.2,0-0.3-0.2-0.3-0.3c2-14.5,5.1-21.3,9.8-21.3\n\t\t\t\tc4.7,0,7.8,6.8,9.8,21.3c0,0.1-0.1,0.3-0.2,0.3c-0.2,0-0.3-0.1-0.3-0.2c-1.9-14-4.9-20.8-9.3-20.8c-4.3,0-7.3,6.6-9.3,20.8\n\t\t\t\tC515.4,29.5,515.3,29.6,515.1,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M521.8,29.6C521.8,29.6,521.8,29.5,521.8,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.9-14,4.9-20.5,9.4-20.5\n\t\t\t\tc4.5,0,7.5,6.5,9.5,20.5c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.8-13.5-4.8-20-8.9-20c-4.2,0-7,6.4-8.9,20\n\t\t\t\tC522.1,29.5,522,29.6,521.8,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M509.1,29.6C509.1,29.6,509.1,29.5,509.1,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.9-14,5-20.5,9.5-20.5\n\t\t\t\tc4.5,0,7.5,6.5,9.5,20.5c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.8-13.5-4.8-20-8.9-20c-4.2,0-7,6.4-8.9,20\n\t\t\t\tC509.4,29.5,509.3,29.6,509.1,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M547.1,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.4-10.6-4.5-16.8-9-17.8c-1-0.2-2-0.1-2.9,0.5\n\t\t\t\tc-2.7,1.8-4.6,7.5-6,17.3c0,0.1-0.1,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1.4-10,3.4-15.7,6.2-17.7c1-0.7,2.1-0.9,3.3-0.6\n\t\t\t\tc4.7,1.1,7.9,7.4,9.4,18.3C547.4,29.4,547.2,29.5,547.1,29.6C547.1,29.5,547.1,29.6,547.1,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M519.7,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.6-11.6-6.2-17.8-8.9-17.8c-5.4,0-7.3,6.5-8.9,17.8\n\t\t\t\tc0,0.1-0.1,0.2-0.3,0.2c0,0,0,0,0,0c-0.1,0-0.3-0.2-0.2-0.3c1.6-11.6,3.7-18.3,9.4-18.3c3.4,0,7.9,7,9.5,18.3\n\t\t\t\tC520,29.4,519.9,29.5,519.7,29.6C519.8,29.5,519.7,29.6,519.7,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M537.1,29.6C537.1,29.6,537.1,29.5,537.1,29.6c-0.2,0-0.3-0.2-0.3-0.3c1-7,3.8-12.9,6.7-14.1\n\t\t\t\tc0.9-0.4,1.8-0.2,2.6,0.4l0.1,0.1c2.4,1.9,5.7,4.6,6.9,13.6c0,0.1-0.1,0.3-0.2,0.3c-0.2,0-0.3-0.1-0.3-0.2\n\t\t\t\tc-1.2-8.8-4.4-11.3-6.7-13.2l-0.1-0.1c-0.6-0.5-1.3-0.6-2-0.3c-2.7,1.1-5.4,6.9-6.3,13.6C537.4,29.5,537.3,29.6,537.1,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M504.5,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.8-6-3-7.8-4.6-9.1l-0.1-0.1c-0.4-0.3-0.9-0.4-1.3-0.2\n\t\t\t\tc-1.8,0.7-3.7,4.8-4.3,9.4c0,0.1-0.1,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.7-4.9,2.7-9,4.7-9.8c0.7-0.3,1.3-0.2,1.9,0.3l0.1,0.1\n\t\t\t\tc1.7,1.4,4,3.2,4.8,9.5C504.8,29.4,504.7,29.5,504.5,29.6C504.5,29.5,504.5,29.6,504.5,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M556.9,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.6-4.3-2.1-5.5-3.3-6.4l-0.1,0c-0.3-0.2-0.6-0.3-0.9-0.1\n\t\t\t\tc-1.1,0.4-2.5,2.9-3,6.6c0,0.1-0.1,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.5-3.5,1.9-6.5,3.4-7c0.5-0.2,1-0.1,1.4,0.2l0.1,0\n\t\t\t\tc1.2,1,2.8,2.3,3.4,6.8C557.2,29.4,557.1,29.5,556.9,29.6C556.9,29.5,556.9,29.6,556.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M496.2,29.6C496.2,29.6,496.2,29.5,496.2,29.6c-0.2,0-0.3-0.2-0.3-0.3c1-7,3.8-12.9,6.7-14.1\n\t\t\t\tc0.9-0.4,1.8-0.2,2.6,0.4l0.1,0.1c2.4,1.9,5.7,4.6,6.9,13.6c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2\n\t\t\t\tc-1.2-8.8-4.4-11.3-6.7-13.2l-0.1-0.1c-0.6-0.5-1.3-0.6-2-0.3c-2.7,1.1-5.4,6.9-6.3,13.6C496.4,29.5,496.3,29.6,496.2,29.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M602.9,29.6c-0.1,0-0.3-0.1-0.3-0.2c-2-14.6-5.3-21.6-9.9-21.6c-4.6,0-7.8,6.9-9.9,21.6\n\t\t\t\tc0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c2.1-15.1,5.5-22.1,10.4-22.1c4.9,0,8.4,7.2,10.4,22.1\n\t\t\t\tC603.2,29.4,603.1,29.5,602.9,29.6C602.9,29.5,602.9,29.6,602.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M609.2,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.9-14-5.1-20.8-9.5-20.8c-4.5,0-7.5,6.6-9.5,20.8\n\t\t\t\tc0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c2.1-14.5,5.3-21.3,10-21.3c4.8,0,8,7,10,21.3C609.5,29.4,609.4,29.5,609.2,29.6\n\t\t\t\tC609.3,29.5,609.3,29.6,609.2,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M576.2,29.6C576.2,29.6,576.2,29.5,576.2,29.6c-0.2,0-0.3-0.2-0.3-0.3C578,14.7,581.2,8,586,8\n\t\t\t\tc4.8,0,8,7,10,21.3c0,0.1-0.1,0.3-0.2,0.3c-0.2,0-0.3-0.1-0.3-0.2c-2-14-5.1-20.8-9.5-20.8c-4.5,0-7.5,6.6-9.5,20.8\n\t\t\t\tC576.4,29.5,576.3,29.6,576.2,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M597,29.6C597,29.6,597,29.5,597,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.5-10.3,3.6-16.2,6.6-18.3\n\t\t\t\tc1.1-0.7,2.3-1,3.5-0.7c5,1.1,8.4,7.7,10,19c0,0.1-0.1,0.3-0.2,0.3c-0.2,0-0.3-0.1-0.3-0.2c-1.5-11-4.8-17.4-9.6-18.5\n\t\t\t\tc-1.1-0.3-2.2-0.1-3.1,0.6c-2.8,1.9-4.9,7.8-6.3,17.9C597.3,29.5,597.1,29.6,597,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M567.9,29.6C567.9,29.6,567.9,29.5,567.9,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.7-12,3.9-19,10-19\n\t\t\t\tc3.6,0,8.4,7.2,10,19c0,0.1-0.1,0.3-0.2,0.3c0,0,0,0,0,0c-0.1,0-0.3-0.1-0.3-0.2c-1.7-12.1-6.6-18.5-9.5-18.5\n\t\t\t\tc-5.7,0-7.8,6.8-9.5,18.5C568.2,29.5,568.1,29.6,567.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M622.7,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.3-9.1-4.7-11.8-7.1-13.7l-0.1-0.1c-0.7-0.5-1.4-0.6-2.2-0.3\n\t\t\t\tc-2.8,1.1-5.7,7.2-6.7,14.2c0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.2,4-13.4,7.1-14.6c1-0.4,1.9-0.3,2.8,0.4l0.1,0.1\n\t\t\t\tc2.6,2,6,4.8,7.3,14.1C623,29.4,622.9,29.5,622.7,29.6C622.8,29.5,622.8,29.6,622.7,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M571.2,29.6c-0.1,0-0.3-0.1-0.3-0.2c-0.9-6.3-3.2-8.1-4.9-9.5l-0.1-0.1c-0.5-0.4-0.9-0.4-1.5-0.2\n\t\t\t\tc-1.9,0.8-3.9,5-4.6,9.8c0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c0.7-5,2.8-9.3,5-10.2c0.7-0.3,1.4-0.2,2,0.3l0.1,0.1\n\t\t\t\tc1.8,1.4,4.2,3.3,5.1,9.8C571.5,29.4,571.4,29.5,571.2,29.6C571.3,29.5,571.2,29.6,571.2,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M618.8,29.6C618.8,29.6,618.8,29.5,618.8,29.6c-0.2,0-0.3-0.2-0.3-0.3c0.5-3.6,2-6.7,3.6-7.3\n\t\t\t\tc0.5-0.2,1.1-0.1,1.5,0.2l0.1,0c1.3,1,3,2.4,3.7,7c0,0.1-0.1,0.3-0.2,0.3c0,0,0,0,0,0c-0.1,0-0.3-0.1-0.3-0.2\n\t\t\t\tc-0.6-4.4-2.3-5.7-3.5-6.7l-0.1-0.1c-0.3-0.2-0.6-0.3-1-0.1c-1.2,0.5-2.7,3-3.2,6.9C619,29.5,618.9,29.6,618.8,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M579.2,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.3-9.1-4.7-11.8-7.1-13.7l-0.1-0.1c-0.7-0.5-1.4-0.6-2.2-0.3\n\t\t\t\tc-2.8,1.1-5.7,7.2-6.7,14.2c0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.2,4-13.4,7.1-14.6c1-0.4,1.9-0.3,2.8,0.4l0.1,0.1\n\t\t\t\tc2.6,2,6,4.8,7.3,14.1C579.5,29.4,579.4,29.5,579.2,29.6C579.2,29.5,579.2,29.6,579.2,29.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M672.7,29.6c-0.1,0-0.3-0.1-0.3-0.2c-2-14.6-5.1-21.6-9.5-21.6c-4.5,0-7.5,6.9-9.5,21.6\n\t\t\t\tc0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c2.1-15.1,5.3-22.1,10.1-22.1c4.8,0,8,7,10.1,22.1C673,29.4,672.9,29.5,672.7,29.6\n\t\t\t\tC672.8,29.5,672.7,29.6,672.7,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M660,29.6C660,29.6,660,29.5,660,29.6c-0.2,0-0.3-0.2-0.3-0.3c2-14.5,5.1-21.3,9.7-21.3\n\t\t\t\tc4.7,0,7.7,6.8,9.7,21.3c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.9-14-4.9-20.8-9.2-20.8c-4.3,0-7.2,6.6-9.2,20.8\n\t\t\t\tC660.3,29.5,660.2,29.6,660,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M647,29.6C647,29.6,647,29.5,647,29.6c-0.2,0-0.3-0.2-0.3-0.3c2-14.7,5-21.3,9.7-21.3\n\t\t\t\tc4.7,0,7.7,6.8,9.7,21.3c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-1.9-14-4.9-20.8-9.2-20.8c-4.3,0-7.2,6.6-9.2,20.8\n\t\t\t\tC647.2,29.5,647.1,29.6,647,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M667.1,29.6C667.1,29.6,667,29.5,667.1,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.4-10.4,3.5-16.4,6.4-18.3\n\t\t\t\tc1-0.7,2.1-0.9,3.4-0.6c4.8,1.1,8.1,7.7,9.6,19c0,0.1-0.1,0.3-0.2,0.3c-0.2,0-0.3-0.1-0.3-0.2c-1.5-11-4.7-17.4-9.2-18.5\n\t\t\t\tc-1.1-0.3-2-0.1-2.9,0.5c-2.8,1.9-4.8,7.8-6.2,18C667.3,29.5,667.2,29.6,667.1,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M639,29.6C639,29.6,639,29.5,639,29.6c-0.2,0-0.3-0.2-0.3-0.3c1.7-12,3.8-19,9.7-19c3.4,0,8.1,7.2,9.7,19\n\t\t\t\tc0,0.1-0.1,0.3-0.2,0.3c-0.2,0-0.3-0.1-0.3-0.2c-1.6-12.1-6.4-18.5-9.2-18.5c-5.5,0-7.5,6.8-9.2,18.5\n\t\t\t\tC639.3,29.5,639.2,29.6,639,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M691.9,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9.1-4.5-11.8-6.9-13.7l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3\n\t\t\t\tc-2.8,1.1-5.6,7.2-6.5,14.2c0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.3,3.9-13.4,6.9-14.6c0.9-0.4,1.8-0.2,2.6,0.4\n\t\t\t\tl0.1,0.1c2.5,2,5.8,4.8,7.1,14.1C692.2,29.4,692.1,29.5,691.9,29.6C691.9,29.5,691.9,29.6,691.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M631,29.6C631,29.6,631,29.5,631,29.6c-0.2,0-0.3-0.2-0.3-0.3c0.7-5.1,2.7-9.4,4.8-10.2\n\t\t\t\tc0.7-0.3,1.3-0.2,1.9,0.3l0.1,0.1c1.7,1.4,4.1,3.3,4.9,9.8c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2\n\t\t\t\tc-0.8-6.3-3.1-8.1-4.7-9.5l-0.1-0.1c-0.4-0.3-0.9-0.4-1.4-0.2c-1.9,0.7-3.8,4.9-4.5,9.8C631.2,29.5,631.1,29.6,631,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M688.1,29.6C688.1,29.6,688.1,29.5,688.1,29.6c-0.2,0-0.3-0.2-0.3-0.3c0.5-3.6,2-6.7,3.5-7.3\n\t\t\t\tc0.5-0.2,1-0.1,1.4,0.2l0.1,0.1c1.2,1,2.9,2.4,3.5,7c0,0.1-0.1,0.3-0.2,0.3c-0.1,0-0.3-0.1-0.3-0.2c-0.6-4.4-2.2-5.7-3.3-6.7\n\t\t\t\tl-0.1-0.1c-0.3-0.2-0.6-0.3-0.9-0.1c-1.1,0.4-2.6,3-3.1,6.9C688.3,29.5,688.2,29.6,688.1,29.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M649.9,29.6c-0.1,0-0.3-0.1-0.3-0.2c-1.2-9.1-4.5-11.8-6.9-13.7l-0.1-0.1c-0.6-0.5-1.3-0.6-2.1-0.3\n\t\t\t\tc-2.8,1.1-5.6,7.2-6.5,14.2c0,0.1-0.2,0.2-0.3,0.2c-0.1,0-0.3-0.2-0.2-0.3c1-7.3,3.9-13.4,6.9-14.6c0.9-0.4,1.8-0.2,2.6,0.4\n\t\t\t\tl0.1,0.1c2.5,2,5.8,4.8,7.1,14.1C650.2,29.4,650,29.5,649.9,29.6C649.9,29.5,649.9,29.6,649.9,29.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g></g>\n<g>\n<path d='M690.5,67.1c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c12.4-2,18.4-5.1,18.4-9.6\n\t\t\t\tc0-4.5-5.9-7.6-18.4-9.6c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c16.9,2.8,18.9,7.1,18.9,10.2\n\t\t\t\tC709.4,61.8,703.2,65.1,690.5,67.1C690.5,67.1,690.5,67.1,690.5,67.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,73.3c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c11.9-1.9,17.7-4.9,17.7-9.3\n\t\t\t\tc0-4.3-5.6-7.3-17.7-9.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c16.3,2.7,18.2,6.9,18.2,9.8\n\t\t\t\tC708.7,68.2,702.7,71.4,690.5,73.3C690.5,73.3,690.5,73.3,690.5,73.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,60.1c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c11.9-1.9,17.7-4.9,17.7-9.3\n\t\t\t\tc0-4.3-5.6-7.3-17.7-9.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c16.3,2.7,18.2,6.9,18.2,9.8\n\t\t\t\tC708.7,55,702.7,58.2,690.5,60.1C690.5,60.1,690.5,60.1,690.5,60.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,80.4c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c9.4-1.5,14.8-4.7,15.8-9.3\n\t\t\t\tc0.2-1.2,0-2.3-0.7-3.3c-1.8-2.6-6.7-4.5-15.1-5.9c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c8.5,1.4,13.6,3.4,15.5,6.1\n\t\t\t\tc0.8,1.1,1,2.4,0.8,3.7C705.7,75.5,700.1,78.9,690.5,80.4C690.5,80.4,690.5,80.4,690.5,80.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,52.1c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c9.4-1.5,15.8-6,15.8-9.3\n\t\t\t\tc0-5.6-5.8-7.6-15.8-9.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c10.3,1.7,16.2,3.8,16.2,9.8\n\t\t\t\tC706.7,45.7,700.5,50.5,690.5,52.1C690.5,52.1,690.5,52.1,690.5,52.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,86.5c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c7.7-1.2,10-4.5,11.7-6.9l0.1-0.1\n\t\t\t\tc0.5-0.7,0.6-1.5,0.2-2.4c-1.2-2.7-6.2-5.4-12-6.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c6,1,11.2,3.8,12.4,6.7\n\t\t\t\tc0.4,1,0.4,2-0.3,2.9l-0.1,0.1C700.8,81.8,698.5,85.2,690.5,86.5C690.5,86.5,690.5,86.5,690.5,86.5z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,36.2c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c5.3-0.8,6.9-3.1,8-4.8l0.1-0.1\n\t\t\t\tc0.3-0.5,0.4-1,0.1-1.6c-0.8-1.9-4.3-3.7-8.2-4.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c4.2,0.7,7.8,2.6,8.7,4.7\n\t\t\t\tc0.3,0.7,0.3,1.5-0.2,2.1l-0.1,0.1C697.7,33,696.1,35.4,690.5,36.2C690.5,36.2,690.5,36.2,690.5,36.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,90.7c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c3.7-0.6,4.9-2.2,5.7-3.4l0-0.1\n\t\t\t\tc0.2-0.3,0.2-0.7,0.1-1.1c-0.5-1.1-2.6-2.5-5.8-3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c3,0.5,5.6,1.9,6.2,3.4\n\t\t\t\tc0.2,0.6,0.2,1.1-0.1,1.6l0,0.1C695.7,88.3,694.5,90,690.5,90.7C690.5,90.7,690.5,90.7,690.5,90.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,44c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c7.7-1.2,10-4.5,11.7-6.9l0.1-0.1\n\t\t\t\tc0.5-0.7,0.6-1.5,0.2-2.4c-1.2-2.7-6.2-5.4-12-6.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c6,1,11.2,3.8,12.4,6.7\n\t\t\t\tc0.4,1,0.4,2.1-0.3,2.9l-0.1,0.1C700.8,39.3,698.5,42.7,690.5,44C690.5,44,690.5,44,690.5,44z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M690.5,135.6c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c12.4-2,18.4-5.1,18.4-9.6\n\t\t\t\tc0-4.5-5.9-7.6-18.4-9.6c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c16.9,2.8,18.9,7.1,18.9,10.2\n\t\t\t\tC709.4,130.2,703.2,133.5,690.5,135.6C690.5,135.5,690.5,135.6,690.5,135.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,141.8c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c11.9-1.9,17.7-4.9,17.7-9.3\n\t\t\t\tc0-4.3-5.6-7.3-17.7-9.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c16.3,2.7,18.2,6.9,18.2,9.8\n\t\t\t\tC708.7,136.6,702.7,139.8,690.5,141.8C690.5,141.8,690.5,141.8,690.5,141.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,128.6c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c11.9-1.9,17.7-4.9,17.7-9.3\n\t\t\t\tc0-4.3-5.6-7.3-17.7-9.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c16.3,2.7,18.2,6.9,18.2,9.8\n\t\t\t\tC708.7,123.4,702.7,126.6,690.5,128.6C690.5,128.6,690.5,128.6,690.5,128.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,148.9c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c9.4-1.5,14.8-4.7,15.8-9.3\n\t\t\t\tc0.2-1.2,0-2.3-0.7-3.3c-1.8-2.6-6.7-4.5-15.1-5.9c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c8.5,1.4,13.6,3.4,15.5,6.1\n\t\t\t\tc0.8,1.1,1,2.4,0.8,3.7C705.7,144,700.1,147.3,690.5,148.9C690.5,148.9,690.5,148.9,690.5,148.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,120.5c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c9.4-1.5,15.8-6,15.8-9.3\n\t\t\t\tc0-5.6-5.8-7.6-15.8-9.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c10.3,1.7,16.2,3.8,16.2,9.8\n\t\t\t\tC706.7,114.2,700.5,118.9,690.5,120.5C690.5,120.5,690.5,120.5,690.5,120.5z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,154.9c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c7.7-1.2,10-4.5,11.7-6.9l0.1-0.1\n\t\t\t\tc0.5-0.7,0.6-1.5,0.2-2.4c-1.2-2.7-6.2-5.4-12-6.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c6,1,11.2,3.8,12.4,6.7\n\t\t\t\tc0.4,1,0.4,2.1-0.3,2.9l-0.1,0.1C700.8,150.2,698.5,153.6,690.5,154.9C690.5,154.9,690.5,154.9,690.5,154.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,104.7c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c5.3-0.8,6.9-3.1,8-4.8l0.1-0.1\n\t\t\t\tc0.3-0.5,0.4-1,0.1-1.6c-0.8-1.9-4.3-3.7-8.2-4.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c4.2,0.7,7.8,2.6,8.7,4.7\n\t\t\t\tc0.3,0.7,0.3,1.5-0.2,2.1l-0.1,0.1C697.7,101.4,696.1,103.8,690.5,104.7C690.5,104.7,690.5,104.7,690.5,104.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,159.1c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c3.8-0.6,4.9-2.2,5.7-3.4l0-0.1\n\t\t\t\tc0.2-0.3,0.2-0.7,0.1-1c-0.5-1.1-2.6-2.5-5.8-3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c3,0.5,5.6,1.9,6.2,3.4\n\t\t\t\tc0.2,0.6,0.2,1.1-0.1,1.6l0,0.1C695.7,156.8,694.5,158.5,690.5,159.1C690.5,159.1,690.5,159.1,690.5,159.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,112.4c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c7.7-1.2,10-4.5,11.7-6.9l0.1-0.1\n\t\t\t\tc0.5-0.7,0.6-1.5,0.2-2.4c-1.2-2.7-6.2-5.4-12-6.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c6,1,11.2,3.8,12.4,6.7\n\t\t\t\tc0.4,1,0.4,2-0.3,2.9l-0.1,0.1C700.8,107.8,698.5,111.2,690.5,112.4C690.5,112.4,690.5,112.4,690.5,112.4z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M690.5,204c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c12.4-2,18.4-5.1,18.4-9.6\n\t\t\t\tc0-4.5-5.9-7.6-18.4-9.6c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c16.9,2.8,18.9,7.1,18.9,10.2\n\t\t\t\tC709.4,198.7,703.2,202,690.5,204C690.5,204,690.5,204,690.5,204z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,210.2c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c11.9-1.9,17.7-4.9,17.7-9.3\n\t\t\t\tc0-4.3-5.6-7.3-17.7-9.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c16.3,2.7,18.2,6.9,18.2,9.8\n\t\t\t\tC708.7,205.1,702.7,208.3,690.5,210.2C690.5,210.2,690.5,210.2,690.5,210.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,197c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c11.9-1.9,17.7-4.9,17.7-9.3\n\t\t\t\tc0-4.3-5.6-7.3-17.7-9.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c16.3,2.7,18.2,6.9,18.2,9.8\n\t\t\t\tC708.7,191.9,702.7,195.1,690.5,197C690.5,197,690.5,197,690.5,197z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,217.3c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c9.4-1.5,14.8-4.7,15.8-9.3\n\t\t\t\tc0.2-1.2,0-2.3-0.7-3.3c-1.8-2.6-6.7-4.5-15.1-5.9c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c8.5,1.4,13.6,3.4,15.5,6.1\n\t\t\t\tc0.8,1.1,1,2.4,0.8,3.7C705.7,212.4,700.1,215.8,690.5,217.3C690.5,217.3,690.5,217.3,690.5,217.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,189c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c9.4-1.5,15.8-6,15.8-9.3\n\t\t\t\tc0-5.6-5.8-7.6-15.8-9.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c10.3,1.7,16.2,3.8,16.2,9.8\n\t\t\t\tC706.7,182.6,700.5,187.4,690.5,189C690.5,189,690.5,189,690.5,189z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,223.4c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c7.7-1.2,10-4.5,11.7-6.9l0.1-0.1\n\t\t\t\tc0.5-0.7,0.6-1.5,0.2-2.4c-1.2-2.7-6.2-5.4-12-6.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c6,1,11.2,3.8,12.4,6.7\n\t\t\t\tc0.4,1,0.4,2.1-0.3,2.9l-0.1,0.1C700.8,218.7,698.5,222.1,690.5,223.4C690.5,223.4,690.5,223.4,690.5,223.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,173.1c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c5.3-0.8,6.9-3.1,8-4.8l0.1-0.1\n\t\t\t\tc0.3-0.5,0.4-1,0.1-1.6c-0.8-1.9-4.3-3.7-8.2-4.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.3,0.3-0.2c4.2,0.7,7.8,2.6,8.7,4.7\n\t\t\t\tc0.3,0.7,0.3,1.5-0.2,2.1l-0.1,0.1C697.7,169.9,696.1,172.3,690.5,173.1C690.5,173.1,690.5,173.1,690.5,173.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,227.6c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c3.7-0.6,4.9-2.2,5.7-3.4l0-0.1\n\t\t\t\tc0.2-0.3,0.2-0.7,0.1-1c-0.5-1.1-2.6-2.5-5.8-3c-0.1,0-0.3-0.2-0.2-0.3c0-0.2,0.2-0.2,0.3-0.2c3,0.5,5.6,1.9,6.2,3.4\n\t\t\t\tc0.2,0.6,0.2,1.1-0.1,1.6l0,0.1C695.7,225.2,694.5,226.9,690.5,227.6C690.5,227.6,690.5,227.6,690.5,227.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,180.9c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c7.7-1.2,10-4.5,11.7-6.9l0.1-0.1\n\t\t\t\tc0.5-0.7,0.6-1.5,0.2-2.4c-1.2-2.7-6.2-5.4-12-6.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.2,0.2-0.2,0.3-0.2c6,1,11.2,3.8,12.4,6.7\n\t\t\t\tc0.4,1,0.4,2.1-0.3,2.9l-0.1,0.1C700.8,176.2,698.5,179.6,690.5,180.9C690.5,180.9,690.5,180.9,690.5,180.9z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M690.5,269.4c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c12.2-1.9,18.2-5,18.2-9.3\n\t\t\t\tc0-4.4-5.8-7.4-18.2-9.3c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c16.7,2.7,18.6,6.9,18.6,9.9\n\t\t\t\tC709.1,264.2,703,267.5,690.5,269.4C690.5,269.4,690.5,269.4,690.5,269.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,275.5c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c11.7-1.8,17.5-4.8,17.5-9\n\t\t\t\tc0-4.2-5.5-7.1-17.5-9c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c16.1,2.6,17.9,6.7,17.9,9.5\n\t\t\t\tC708.4,270.4,702.6,273.6,690.5,275.5C690.5,275.5,690.5,275.5,690.5,275.5z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,262.7c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c11.7-1.8,17.5-4.8,17.5-9\n\t\t\t\tc0-4.2-5.5-7.1-17.5-9c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c16.1,2.6,17.9,6.7,17.9,9.5\n\t\t\t\tC708.4,257.6,702.6,260.8,690.5,262.7C690.5,262.7,690.5,262.7,690.5,262.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,282.4c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c9.2-1.5,14.6-4.6,15.5-9\n\t\t\t\tc0.2-1.2,0-2.2-0.6-3.2c-1.8-2.5-6.6-4.4-14.9-5.8c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c8.4,1.4,13.4,3.3,15.2,6\n\t\t\t\tc0.7,1.1,1,2.3,0.7,3.6C705.5,277.6,700,280.9,690.5,282.4C690.5,282.4,690.5,282.4,690.5,282.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,254.8c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c10.1-1.6,15.5-6.2,15.5-9\n\t\t\t\tc0-5.4-5.7-7.4-15.5-9c-0.1,0-0.3-0.2-0.2-0.3c0-0.2,0.2-0.2,0.3-0.2c10.1,1.6,16,3.7,16,9.5\n\t\t\t\tC706.5,248.7,700.4,253.3,690.5,254.8C690.5,254.8,690.5,254.8,690.5,254.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,288.3c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c7.6-1.2,9.9-4.4,11.5-6.8l0.1-0.1\n\t\t\t\tc0.5-0.7,0.6-1.5,0.2-2.3c-1.1-2.7-6.1-5.3-11.8-6.2c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c5.9,0.9,11,3.7,12.2,6.5\n\t\t\t\tc0.4,1,0.3,2-0.3,2.8l-0.1,0.1C700.7,283.7,698.3,287,690.5,288.3C690.5,288.3,690.5,288.3,690.5,288.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,239.4c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c5.2-0.8,6.8-3,7.9-4.6l0.1-0.1\n\t\t\t\tc0.3-0.5,0.4-1,0.1-1.5c-0.8-1.8-4.2-3.6-8.1-4.2c-0.1,0-0.3-0.2-0.2-0.3c0-0.2,0.2-0.2,0.3-0.2c4.2,0.7,7.7,2.5,8.5,4.6\n\t\t\t\tc0.3,0.7,0.2,1.4-0.2,2l-0.1,0.1C697.6,236.2,696,238.6,690.5,239.4C690.5,239.4,690.5,239.4,690.5,239.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,292.3c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c3.7-0.6,4.8-2.1,5.6-3.3l0-0.1\n\t\t\t\tc0.2-0.3,0.2-0.6,0.1-1c-0.5-1.1-2.6-2.5-5.7-3c-0.1,0-0.3-0.2-0.2-0.3c0-0.2,0.2-0.2,0.3-0.2c3,0.5,5.5,1.8,6.1,3.3\n\t\t\t\tc0.2,0.5,0.2,1.1-0.1,1.5l0,0.1C695.6,290,694.4,291.7,690.5,292.3C690.5,292.3,690.5,292.3,690.5,292.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M690.5,247c-0.1,0-0.2-0.1-0.3-0.2c0-0.1,0.1-0.3,0.2-0.3c7.6-1.2,9.9-4.4,11.5-6.7l0.1-0.1\n\t\t\t\tc0.5-0.7,0.6-1.5,0.2-2.3c-1.1-2.7-6.1-5.3-11.8-6.2c-0.1,0-0.3-0.2-0.2-0.3c0-0.1,0.2-0.2,0.3-0.2c5.9,0.9,11,3.7,12.2,6.5\n\t\t\t\tc0.4,1,0.3,2-0.3,2.8l-0.1,0.1C700.7,242.4,698.3,245.7,690.5,247C690.5,247,690.5,247,690.5,247z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g></g>\n<g>\n<path d='M30.2,269.9C30.1,269.9,30.1,269.9,30.2,269.9c-15.5-2.1-22.7-5.3-22.7-10.2c0-4.9,7.2-8.1,22.6-10.2\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-14.9,2-22.2,5.1-22.2,9.6c0,4.5,7,7.6,22.2,9.6c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,269.8,30.3,269.9,30.2,269.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,263C30.1,263,30.1,263,30.2,263c-15.1-2.1-21.8-5.1-21.8-9.8c0-4.7,6.9-7.8,21.8-9.8\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-14.4,1.9-21.3,4.9-21.3,9.3c0,4.3,6.8,7.3,21.3,9.3c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,262.9,30.3,263,30.2,263z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,276.2C30.1,276.2,30.1,276.2,30.2,276.2c-15.1-2.1-21.8-5.1-21.8-9.8c0-4.7,6.9-7.8,21.8-9.8\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3C15.8,259,8.9,262,8.9,266.4c0,4.3,6.8,7.3,21.3,9.3c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,276.1,30.3,276.2,30.2,276.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,255.9C30.1,255.9,30.1,255.9,30.2,255.9c-10.7-1.4-16.8-3.6-18.8-6.5c-0.7-1-0.9-2.1-0.6-3.4\n\t\t\t\tc1.2-4.8,7.9-8.2,19.4-9.7c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-11.3,1.5-17.9,4.7-19,9.3c-0.3,1.1-0.1,2,0.5,2.9\n\t\t\t\tc1.9,2.8,7.9,4.8,18.4,6.3c0.1,0,0.3,0.2,0.2,0.3C30.4,255.8,30.3,255.9,30.2,255.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,284.2C30.1,284.2,30.1,284.2,30.2,284.2c-12.3-1.7-19.5-3.8-19.5-9.8c0-3.5,7.4-8.2,19.4-9.8\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-12.4,1.6-19,6.4-19,9.3c0,5.6,6.9,7.6,19,9.3c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,284.1,30.3,284.2,30.2,284.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,247.1C30.1,247.1,30.1,247.1,30.2,247.1c-7.5-1-13.8-3.9-15-7c-0.4-0.9-0.2-1.9,0.4-2.6l0.1-0.1\n\t\t\t\tc2.1-2.5,4.9-5.9,14.4-7.2c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-9.3,1.2-12.1,4.5-14.1,7l-0.1,0.1\n\t\t\t\tc-0.5,0.6-0.7,1.3-0.4,2.1c1.1,2.8,7.3,5.6,14.5,6.6c0.1,0,0.3,0.2,0.2,0.3C30.4,247,30.3,247.1,30.2,247.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,292.3C30.1,292.3,30.1,292.3,30.2,292.3c-5.3-0.7-9.7-2.8-10.5-4.9c-0.3-0.7-0.2-1.3,0.3-1.9\n\t\t\t\tl0.1-0.1c1.4-1.7,3.4-4.1,10.1-5c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-6.4,0.9-8.3,3.1-9.7,4.8l-0.1,0.1\n\t\t\t\tc-0.4,0.4-0.4,0.9-0.2,1.4c0.7,1.9,5.1,3.9,10,4.5c0.1,0,0.3,0.2,0.2,0.3C30.4,292.2,30.3,292.3,30.2,292.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,234.6C30.1,234.6,30.1,234.6,30.2,234.6c-3.8-0.5-6.9-2-7.5-3.5c-0.2-0.5-0.1-1,0.2-1.4l0.1-0.1\n\t\t\t\tc1-1.2,2.4-2.9,7.2-3.6c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-4.5,0.6-5.9,2.2-6.8,3.4l-0.1,0.1\n\t\t\t\tc-0.2,0.3-0.3,0.6-0.2,0.9c0.4,1.1,3.1,2.6,7,3.2c0.1,0,0.3,0.2,0.2,0.3C30.4,234.5,30.3,234.6,30.2,234.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,289.6C30.1,289.6,30.1,289.6,30.2,289.6c-7.5-1-13.8-3.9-15-7c-0.4-0.9-0.2-1.9,0.4-2.6l0.1-0.1\n\t\t\t\tc2.1-2.5,4.9-5.9,14.4-7.1c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-9.3,1.2-12.1,4.5-14.1,7l-0.1,0.1\n\t\t\t\tc-0.5,0.6-0.7,1.3-0.4,2.1c1.1,2.8,7.3,5.6,14.5,6.6c0.1,0,0.3,0.2,0.2,0.3C30.4,289.5,30.3,289.6,30.2,289.6z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M30.2,201.5C30.1,201.5,30.1,201.5,30.2,201.5c-15.5-2.1-22.7-5.3-22.7-10.2c0-4.9,7.2-8.1,22.6-10.2\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-14.9,2-22.2,5.1-22.2,9.6c0,4.5,7,7.6,22.2,9.6c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,201.4,30.3,201.5,30.2,201.5z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,194.5C30.1,194.5,30.1,194.5,30.2,194.5c-15.1-2.1-21.8-5.1-21.8-9.8c0-4.7,6.9-7.8,21.8-9.8\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-14.4,1.9-21.3,4.9-21.3,9.3c0,4.3,6.8,7.3,21.3,9.3c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,194.4,30.3,194.5,30.2,194.5z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,207.7C30.1,207.7,30.1,207.7,30.2,207.7c-14.9-2-21.8-5.1-21.8-9.8c0-4.7,6.9-7.8,21.8-9.8\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-14.4,1.9-21.3,4.9-21.3,9.3c0,4.3,6.8,7.3,21.3,9.3c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,207.6,30.3,207.7,30.2,207.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,187.4C30.1,187.4,30.1,187.4,30.2,187.4c-10.2-1.4-15.8-3.4-17.8-6.3c-0.7-1.1-1-2.3-0.6-3.6\n\t\t\t\tc1.2-5.1,7.2-8.3,18.4-9.7c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-10.9,1.4-16.8,4.5-17.9,9.3c-0.3,1.2-0.1,2.2,0.6,3.2\n\t\t\t\tc1.9,2.7,7.5,4.7,17.4,6c0.1,0,0.3,0.2,0.2,0.3C30.4,187.3,30.3,187.4,30.2,187.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,215.8C30.1,215.8,30.1,215.8,30.2,215.8c-12.3-1.7-19.5-3.8-19.5-9.8c0-3.5,7.4-8.2,19.4-9.8\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-12.4,1.6-19,6.4-19,9.3c0,5.6,6.9,7.6,19,9.3c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,215.7,30.3,215.8,30.2,215.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,178.7C30.1,178.7,30.1,178.7,30.2,178.7c-6.3-0.9-11.1-3.4-12.3-6.4c-0.5-1.3-0.3-2.5,0.6-3.6\n\t\t\t\tc2.5-2.9,2.5-2.9,11.6-6.8c0.1-0.1,0.3,0,0.4,0.1c0.1,0.1,0,0.3-0.1,0.4c-8.9,3.8-8.9,3.8-11.4,6.7c-0.8,0.9-0.9,1.9-0.5,3\n\t\t\t\tc0.8,2.2,4.4,5.1,11.8,6.1c0.1,0,0.3,0.2,0.2,0.3C30.4,178.6,30.3,178.7,30.2,178.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,223.9C30.1,223.9,30.1,223.9,30.2,223.9c-5.3-0.7-9.7-2.8-10.5-4.9c-0.3-0.7-0.2-1.3,0.3-1.9\n\t\t\t\tl0.1-0.1c1.4-1.7,3.4-4.1,10.1-5c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-6.4,0.9-8.3,3.1-9.7,4.8l-0.1,0.1\n\t\t\t\tc-0.4,0.4-0.4,0.9-0.2,1.4c0.7,1.9,5.1,3.9,10,4.5c0.1,0,0.3,0.2,0.2,0.3C30.4,223.8,30.3,223.9,30.2,223.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,166.2C30.1,166.2,30.1,166.2,30.2,166.2c-3.8-0.5-6.9-2-7.5-3.5c-0.2-0.5-0.1-1,0.2-1.4l0.1-0.1\n\t\t\t\tc1-1.2,2.4-2.9,7.2-3.6c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-4.5,0.6-5.9,2.2-6.8,3.4l-0.1,0.1\n\t\t\t\tc-0.2,0.3-0.3,0.6-0.2,0.9c0.4,1.1,3.1,2.6,7.1,3.2c0.1,0,0.3,0.2,0.2,0.3C30.4,166.1,30.3,166.2,30.2,166.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,221.1C30.1,221.1,30.1,221.1,30.2,221.1c-7.5-1-13.8-3.9-15-7c-0.4-0.9-0.2-1.9,0.4-2.6l0.1-0.1\n\t\t\t\tc2.1-2.5,4.9-5.9,14.4-7.2c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-9.3,1.2-12.1,4.5-14.1,7l-0.1,0.1\n\t\t\t\tc-0.5,0.6-0.7,1.3-0.4,2.1c1.1,2.8,7.3,5.6,14.5,6.6c0.1,0,0.3,0.2,0.2,0.3C30.4,221,30.3,221.1,30.2,221.1z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M30.2,134.9C30.1,134.9,30.1,134.9,30.2,134.9c-15.5-2.2-22.7-5.6-22.7-10.6c0-5,7.4-8.5,22.6-10.6\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3C15.3,116.3,8,119.6,8,124.3c0,4.7,7,7.9,22.2,10.1c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,134.8,30.3,134.9,30.2,134.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,127.7C30.1,127.7,30.1,127.7,30.2,127.7c-14.9-2.1-21.8-5.4-21.8-10.2c0-4.8,7.1-8.2,21.8-10.2\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-14.4,2-21.3,5.2-21.3,9.7c0,4.5,6.8,7.6,21.3,9.7c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,127.6,30.3,127.7,30.2,127.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,141.4C30.1,141.4,30.1,141.4,30.2,141.4c-14.9-2.1-21.8-5.4-21.8-10.2c0-4.8,7.1-8.2,21.8-10.2\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-14.4,2-21.3,5.2-21.3,9.7c0,4.5,6.8,7.6,21.3,9.7c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,141.3,30.3,141.4,30.2,141.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,120.3C30.1,120.3,30.1,120.3,30.2,120.3c-10.6-1.5-16.7-3.7-18.8-6.7c-0.7-1.1-1-2.3-0.7-3.6\n\t\t\t\tc1.2-5,7.9-8.6,19.4-10.2c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-11.3,1.6-17.9,4.9-19,9.7c-0.3,1.2-0.1,2.2,0.6,3.2\n\t\t\t\tc2,2.9,8,5,18.4,6.5c0.1,0,0.3,0.2,0.2,0.3C30.4,120.2,30.3,120.3,30.2,120.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,149.9C30.1,149.9,30.1,149.9,30.2,149.9c-12.3-1.7-19.5-4-19.5-10.2c0-3.6,7.4-8.6,19.4-10.2\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-12.4,1.7-19,6.7-19,9.7c0,5.8,6.9,8,19,9.7c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,149.8,30.3,149.9,30.2,149.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,111.1C30.1,111.1,30.1,111.1,30.2,111.1c-7.5-1.1-13.7-4.1-15-7.2c-0.4-1-0.3-2,0.4-2.8l0.1-0.1\n\t\t\t\tc2.1-2.6,4.9-6.1,14.4-7.5c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-9.3,1.3-12.1,4.7-14.1,7.3l-0.1,0.1\n\t\t\t\tc-0.5,0.7-0.7,1.5-0.3,2.3c1.2,2.9,7.4,5.9,14.5,6.9c0.1,0,0.3,0.2,0.2,0.3C30.4,111,30.3,111.1,30.2,111.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,158.3C30.1,158.3,30.1,158.3,30.2,158.3c-5.2-0.7-9.6-2.9-10.5-5c-0.3-0.7-0.2-1.4,0.3-2l0.1-0.1\n\t\t\t\tc1.4-1.8,3.4-4.3,10.1-5.2c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-6.4,0.9-8.3,3.3-9.7,5l-0.1,0.1\n\t\t\t\tc-0.4,0.5-0.4,0.9-0.2,1.5c0.8,2,5.1,4,10,4.7c0.1,0,0.3,0.2,0.2,0.3C30.4,158.2,30.3,158.3,30.2,158.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,98.1C30.1,98.1,30.1,98.1,30.2,98.1c-3.7-0.5-6.9-2.1-7.5-3.6c-0.2-0.5-0.1-1.1,0.2-1.5l0.1-0.1\n\t\t\t\tc1-1.3,2.4-3.1,7.2-3.7c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-4.5,0.6-5.9,2.3-6.8,3.5l-0.1,0.1c-0.2,0.3-0.3,0.6-0.1,1\n\t\t\t\tc0.5,1.2,3.1,2.7,7,3.3c0.1,0,0.3,0.2,0.2,0.3C30.4,98,30.3,98.1,30.2,98.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,155.5C30.1,155.5,30.1,155.5,30.2,155.5c-7.5-1.1-13.7-4.1-15-7.2c-0.4-1-0.3-2,0.4-2.8l0.1-0.1\n\t\t\t\tc2.1-2.6,4.9-6.2,14.4-7.5c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-9.3,1.3-12.1,4.7-14.1,7.3l-0.1,0.1\n\t\t\t\tc-0.5,0.7-0.7,1.5-0.3,2.3c1.2,2.9,7.4,5.9,14.5,6.9c0.1,0,0.3,0.2,0.2,0.3C30.4,155.4,30.3,155.5,30.2,155.5z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M30.2,67.1C30.1,67.1,30.1,67.1,30.2,67.1c-15.3-2-22.3-5.2-22.3-9.9c0-4.8,7.1-7.9,22.3-9.9\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-14.7,1.9-21.8,5-21.8,9.4c0,4.4,6.9,7.4,21.8,9.3c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,67,30.3,67.1,30.2,67.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,60.3C30.1,60.3,30.1,60.3,30.2,60.3c-14.9-2-21.5-4.9-21.5-9.5c0-4.6,6.8-7.6,21.5-9.5\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-14.1,1.8-21,4.8-21,9c0,4.2,6.7,7.1,21,9c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,60.2,30.3,60.3,30.2,60.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,73.1C30.1,73.1,30.1,73.1,30.2,73.1c-14.9-2-21.5-4.9-21.5-9.5c0-4.6,6.8-7.6,21.5-9.5\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-14.1,1.8-21,4.8-21,9c0,4.2,6.7,7.1,21,9c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,73,30.3,73.1,30.2,73.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,53.4C30.1,53.4,30.1,53.4,30.2,53.4C19.6,52,13.5,49.9,11.6,47c-0.7-1-0.9-2.1-0.6-3.2\n\t\t\t\tc1.1-4.7,7.8-8,19.1-9.5c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-11.1,1.5-17.6,4.6-18.7,9.1c-0.2,1-0.1,1.9,0.5,2.8\n\t\t\t\tc1.9,2.7,7.8,4.7,18.2,6.1c0.1,0,0.3,0.2,0.2,0.3C30.4,53.3,30.3,53.4,30.2,53.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,80.9C30.1,80.9,30.1,80.9,30.2,80.9C18,79.3,11,77.2,11,71.4c0-3.4,7.3-8,19.1-9.5\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-12.2,1.6-18.7,6.2-18.7,9c0,5.4,6.8,7.4,18.7,9c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC30.4,80.8,30.3,80.9,30.2,80.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,44.9C30.1,44.9,30.1,44.9,30.2,44.9c-7.4-1-13.7-3.9-14.8-6.8c-0.4-0.9-0.2-1.8,0.5-2.6l0.1-0.1\n\t\t\t\tc2-2.4,4.8-5.7,14.2-7c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-9.2,1.2-11.9,4.4-13.9,6.8l-0.1,0.1c-0.5,0.6-0.6,1.3-0.4,2\n\t\t\t\tc1.1,2.7,7.2,5.5,14.3,6.5c0.1,0,0.3,0.2,0.2,0.3C30.4,44.8,30.3,44.9,30.2,44.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,88.8C30.1,88.8,30.1,88.8,30.2,88.8c-5.2-0.7-9.5-2.7-10.3-4.8c-0.3-0.7-0.1-1.3,0.3-1.9l0.1-0.1\n\t\t\t\tc1.4-1.7,3.4-4,9.9-4.9c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-6.3,0.8-8.2,3-9.6,4.7l-0.1,0.1c-0.3,0.4-0.4,0.8-0.2,1.3\n\t\t\t\tc0.7,1.9,5,3.8,9.9,4.4c0.1,0,0.3,0.2,0.2,0.3C30.4,88.7,30.3,88.8,30.2,88.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,32.7C30.1,32.7,30.1,32.7,30.2,32.7c-3.7-0.5-6.8-1.9-7.4-3.4c-0.2-0.5-0.1-1,0.2-1.4l0-0.1\n\t\t\t\tc1-1.2,2.4-2.9,7.1-3.5c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3c-4.5,0.6-5.8,2.1-6.7,3.3l0,0.1c-0.2,0.3-0.3,0.5-0.2,0.9\n\t\t\t\tc0.4,1.1,3.1,2.6,6.9,3.1c0.1,0,0.3,0.2,0.2,0.3C30.4,32.6,30.3,32.7,30.2,32.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.2,86.2C30.1,86.2,30.1,86.2,30.2,86.2c-7.5-1-13.7-3.9-14.8-6.8c-0.4-0.9-0.2-1.8,0.5-2.6l0.1-0.1\n\t\t\t\tc2-2.4,4.8-5.7,14.2-7c0.2,0,0.3,0.1,0.3,0.2c0,0.1-0.1,0.3-0.2,0.3C21,71.5,18.3,74.7,16.3,77l-0.1,0.1c-0.5,0.6-0.6,1.3-0.4,2\n\t\t\t\tc1.1,2.7,7.2,5.5,14.3,6.5c0.1,0,0.3,0.2,0.2,0.3C30.4,86.1,30.3,86.2,30.2,86.2z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g></g>\n<g>\n<path d='M657.3,311c-4.8,0-8-7-10.1-22.1c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc2,14.6,5.1,21.6,9.5,21.6c4.5,0,7.5-6.9,9.5-21.6c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C665.3,304,662.1,311,657.3,311z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M650.8,310.2c-4.7,0-7.7-6.8-9.7-21.3c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14,4.9,20.8,9.2,20.8c4.3,0,7.2-6.6,9.2-20.8c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC658.5,303.6,655.5,310.2,650.8,310.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M663.9,310.2c-4.7,0-7.7-6.8-9.7-21.3c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14,4.9,20.8,9.2,20.8c4.3,0,7.2-6.6,9.2-20.8c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC671.6,303.4,668.5,310.2,663.9,310.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M644.7,308c-0.3,0-0.7,0-1-0.1c-4.8-1.1-8.1-7.7-9.6-19c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.5,11,4.7,17.4,9.2,18.5c1.1,0.3,2,0.1,2.9-0.5c2.8-1.9,4.8-7.8,6.2-18c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tc-1.4,10.4-3.5,16.4-6.4,18.3C646.4,307.7,645.6,308,644.7,308z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M671.8,307.8c-3.4,0-8.1-7.2-9.7-19c0-0.1,0.1-0.3,0.2-0.3c0.2-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.6,12.1,6.4,18.5,9.2,18.5c5.5,0,7.5-6.8,9.2-18.5c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC679.9,300.9,677.8,307.8,671.8,307.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M637,303.7c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.5-2-5.8-4.8-7.1-14.1c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c1.2,9.1,4.5,11.8,6.9,13.7l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.8-1.1,5.6-7.2,6.5-14.2\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.3-3.9,13.4-6.9,14.6C637.6,303.6,637.3,303.7,637,303.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M684,299.2c-0.4,0-0.8-0.2-1.2-0.5l-0.1-0.1c-1.7-1.4-4.1-3.3-4.9-9.8c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c0.8,6.3,3.1,8.1,4.7,9.5l0.1,0.1c0.4,0.3,0.9,0.4,1.4,0.2c1.9-0.7,3.8-4.9,4.5-9.8\n\t\t\t\tc0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-0.7,5.1-2.7,9.4-4.8,10.2C684.5,299.2,684.3,299.2,684,299.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M628.5,296.3c-0.3,0-0.6-0.1-0.9-0.3l-0.1,0c-1.2-1-2.9-2.4-3.5-7c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c0.6,4.4,2.2,5.7,3.3,6.7l0.1,0c0.3,0.2,0.6,0.3,0.9,0.1c1.1-0.4,2.6-3,3.1-6.9c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.5,3.6-2,6.7-3.5,7.3C628.8,296.3,628.6,296.3,628.5,296.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M679,303.7c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.5-2-5.8-4.8-7.1-14.1c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c1.2,9.1,4.5,11.8,6.9,13.7l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.8-1.1,5.6-7.2,6.5-14.2\n\t\t\t\tc0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.3-3.9,13.4-6.9,14.6C679.7,303.6,679.3,303.7,679,303.7z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M589.6,311c-4.8,0-8-7-10.1-22.1c0-0.1,0.1-0.3,0.2-0.3c0.2-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc2,14.6,5.1,21.6,9.5,21.6c4.5,0,7.5-6.9,9.5-21.6c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C597.6,304,594.4,311,589.6,311z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M583.1,310.2c-4.6,0-7.8-7-9.7-21.3c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14,4.9,20.8,9.2,20.8c4.3,0,7.2-6.6,9.2-20.8c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC590.8,303.4,587.7,310.2,583.1,310.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M596.1,310.2c-4.7,0-7.7-6.8-9.7-21.3c0-0.1,0.1-0.3,0.2-0.3c0.2-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14,4.9,20.8,9.2,20.8c4.3,0,7.2-6.6,9.2-20.8c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC603.8,303.4,600.7,310.2,596.1,310.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M577,308c-0.3,0-0.7,0-1-0.1c-4.8-1.1-8.1-7.7-9.6-19c0-0.1,0.1-0.3,0.2-0.3c0.2-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.5,11,4.7,17.4,9.2,18.5c1.1,0.3,2,0.1,2.9-0.5c2.8-1.9,4.8-7.8,6.2-18c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tc-1.4,10.4-3.5,16.4-6.4,18.3C578.6,307.7,577.8,308,577,308z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M604.1,307.8c-3.4,0-8.1-7.2-9.7-19c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.6,12.1,6.4,18.5,9.2,18.5c5.5,0,7.5-6.8,9.2-18.5c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC612.1,300.9,610,307.8,604.1,307.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M569.2,303.7c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.5-2-5.8-4.8-7.1-14.1c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c1.2,9.1,4.5,11.8,6.9,13.7l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.8-1.1,5.6-7.2,6.5-14.2\n\t\t\t\tc0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.3-3.9,13.4-6.9,14.6C569.9,303.6,569.5,303.7,569.2,303.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M616.3,299.2c-0.4,0-0.8-0.2-1.2-0.5l-0.1-0.1c-1.7-1.4-4.1-3.3-4.9-9.8c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c0.8,6.3,3.1,8.1,4.7,9.5l0.1,0.1c0.4,0.3,0.9,0.4,1.4,0.2c1.9-0.7,3.8-4.9,4.5-9.8\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.2,0,0.3,0.2,0.2,0.3c-0.7,5.1-2.7,9.4-4.8,10.2C616.8,299.2,616.5,299.2,616.3,299.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M560.7,296.3c-0.3,0-0.6-0.1-0.9-0.3l-0.1,0c-1.2-1-2.9-2.4-3.5-7c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2-0.1,0.3,0.1,0.3,0.2c0.6,4.4,2.2,5.7,3.3,6.7l0.1,0c0.3,0.2,0.6,0.3,0.9,0.1c1.1-0.4,2.6-3,3.1-6.9c0-0.1,0.1-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.5,3.6-2,6.7-3.5,7.3C561.1,296.3,560.9,296.3,560.7,296.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M611.3,303.7c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.5-2-5.8-4.8-7.1-14.1c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c1.2,9.1,4.5,11.8,6.9,13.7l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.8-1.1,5.6-7.2,6.5-14.2\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.3-3.9,13.4-6.9,14.6C611.9,303.6,611.6,303.7,611.3,303.7z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M521.9,311c-4.8,0-8-7-10.1-22.1c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc2,14.6,5.1,21.6,9.5,21.6c4.5,0,7.5-6.9,9.5-21.6c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C529.8,304,526.6,311,521.9,311z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M515.3,310.2c-4.7,0-7.7-6.8-9.7-21.3c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14,4.9,20.8,9.2,20.8c4.3,0,7.2-6.6,9.2-20.8c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C523,303.4,520,310.2,515.3,310.2\n\t\t\t\tz' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M528.4,310.2c-4.7,0-7.7-6.8-9.7-21.3c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14,4.9,20.8,9.2,20.8c4.3,0,7.2-6.6,9.2-20.8c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC536.1,303.6,533.1,310.2,528.4,310.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M509.3,308c-0.3,0-0.7,0-1-0.1c-4.8-1.1-8.1-7.7-9.6-19c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.5,11,4.7,17.4,9.2,18.5c1.1,0.3,2,0.1,2.9-0.5c2.7-1.9,4.8-7.8,6.2-18c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tc-1.4,10.4-3.5,16.4-6.4,18.3C510.9,307.7,510.1,308,509.3,308z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M536.4,307.8c-3.4,0-8.1-7.2-9.7-19c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.6,12.1,6.4,18.5,9.2,18.5c5.5,0,7.5-6.8,9.2-18.5c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC544.4,300.9,542.3,307.8,536.4,307.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M501.5,303.7c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.5-2-5.8-4.8-7.1-14.1c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2-0.1,0.3,0.1,0.3,0.2c1.2,9.1,4.5,11.8,6.9,13.7l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.8-1.1,5.6-7.2,6.5-14.2\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.3-3.9,13.4-6.9,14.6C502.1,303.6,501.8,303.7,501.5,303.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M548.5,299.2c-0.4,0-0.8-0.2-1.2-0.5l-0.1-0.1c-1.7-1.4-4.1-3.3-4.9-9.8c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c0.8,6.3,3.1,8.1,4.7,9.5l0.1,0.1c0.4,0.3,0.9,0.4,1.4,0.2c1.9-0.7,3.8-4.9,4.5-9.8\n\t\t\t\tc0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-0.7,5.1-2.7,9.4-4.8,10.2C549,299.2,548.8,299.2,548.5,299.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M493,296.3c-0.3,0-0.6-0.1-0.9-0.3l-0.1,0c-1.2-1-2.9-2.4-3.5-7c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c0.6,4.4,2.2,5.7,3.3,6.7l0.1,0.1c0.3,0.2,0.6,0.3,0.9,0.1c1.1-0.4,2.6-3,3.1-6.9c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.5,3.6-2,6.7-3.5,7.3C493.3,296.3,493.1,296.3,493,296.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M543.5,303.7c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.5-2-5.8-4.8-7.1-14.1c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c1.2,9.1,4.5,11.8,6.9,13.7l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.8-1.1,5.6-7.2,6.5-14.2\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.3-3.9,13.4-6.9,14.6C544.2,303.6,543.8,303.7,543.5,303.7z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M456.8,310.6c-4.6,0-7.8-7.1-9.8-21.8c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14.3,4.9,21.3,9.3,21.3c4.3,0,7.3-6.8,9.3-21.3c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC464.6,303.9,461.6,310.6,456.8,310.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M450.5,309.8c-4.5,0-7.5-6.7-9.4-21c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.8,13.8,4.7,20.5,8.9,20.5c4.2,0,7-6.5,8.9-20.5c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC458,303.4,455.1,309.8,450.5,309.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M463.2,309.8c-4.5,0-7.5-6.7-9.4-21c0-0.1,0.1-0.3,0.2-0.3c0.2-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.8,13.8,4.7,20.5,8.9,20.5c4.2,0,7-6.5,8.9-20.5c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC470.7,303.2,467.7,309.8,463.2,309.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M444.6,307.7c-0.3,0-0.7,0-1-0.1c-4.7-1.1-7.9-7.6-9.4-18.7c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2-0.1,0.3,0.1,0.3,0.2c1.4,10.9,4.5,17.1,9,18.2c1,0.3,1.9,0.1,2.8-0.5c2.7-1.8,4.7-7.6,6-17.7c0-0.1,0.1-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-1.4,10.2-3.4,16.1-6.3,18.1C446.1,307.4,445.4,307.7,444.6,307.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M470.9,307.6c-3.3,0-7.9-7.1-9.4-18.7c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.6,11.9,6.2,18.2,8.9,18.2c5.4,0,7.3-6.7,8.9-18.2c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC478.8,300.7,476.7,307.6,470.9,307.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M437,303.5c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.4-2-5.7-4.7-6.9-13.9c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c1.2,9,4.4,11.6,6.7,13.5l0.1,0.1c0.6,0.5,1.3,0.6,2,0.3c2.7-1,5.4-7.1,6.4-14c0-0.1,0.1-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-1,7.2-3.8,13.3-6.7,14.4C437.6,303.4,437.3,303.5,437,303.5z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M482.8,299.1c-0.4,0-0.8-0.1-1.2-0.4l-0.1-0.1c-1.7-1.4-4-3.3-4.8-9.7c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c0.8,6.2,3,8,4.6,9.3l0.1,0.1c0.4,0.3,0.8,0.4,1.3,0.2c1.8-0.7,3.7-4.9,4.4-9.6c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.7,5-2.7,9.3-4.7,10C483.2,299,483,299.1,482.8,299.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M428.7,296.2c-0.3,0-0.6-0.1-0.9-0.3l-0.1,0c-1.2-1-2.8-2.3-3.4-6.9c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c0.6,4.4,2.1,5.6,3.2,6.6l0.1,0c0.3,0.2,0.5,0.3,0.9,0.1c1.1-0.4,2.5-2.9,3-6.8c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.5,3.6-1.9,6.6-3.4,7.2C429.1,296.1,428.9,296.2,428.7,296.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M477.9,303.5c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.4-2-5.7-4.7-6.9-13.9c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c1.2,9,4.4,11.6,6.7,13.5l0.1,0.1c0.6,0.5,1.3,0.6,2,0.3c2.7-1,5.4-7.1,6.4-14c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-1,7.2-3.8,13.3-6.7,14.4C478.5,303.4,478.2,303.5,477.9,303.5z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M389.9,310.6c-4.8,0-7.9-6.9-9.9-21.8c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14.3,5,21.3,9.4,21.3c4.4,0,7.4-6.8,9.4-21.3c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC397.8,303.9,394.7,310.6,389.9,310.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M383.5,309.8c-4.6,0-7.6-6.7-9.6-21c0-0.1,0.1-0.3,0.2-0.3c0.2-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,13.8,4.8,20.5,9,20.5c4.2,0,7.1-6.5,9-20.5c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC391.1,303.2,388.1,309.8,383.5,309.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M396.4,309.8c-4.5,0-7.7-6.9-9.6-21c0-0.1,0.1-0.3,0.2-0.3c0.2-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,13.8,4.8,20.5,9,20.5c4.2,0,7.1-6.5,9-20.5c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C404,303.2,400.9,309.8,396.4,309.8\n\t\t\t\tz' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M377.5,307.7c-0.3,0-0.7,0-1-0.1c-4.7-1.1-8-7.6-9.5-18.7c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.5,10.9,4.6,17.1,9.1,18.2c1,0.3,2,0.1,2.9-0.5c2.7-1.9,4.7-7.6,6.1-17.7c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tc-1.4,10.2-3.5,16.1-6.3,18.1C379.1,307.4,378.4,307.7,377.5,307.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M404.2,307.6c-3.4,0-8-7.1-9.5-18.7c0-0.1,0.1-0.3,0.2-0.3c0.1-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.6,11.9,6.3,18.2,9,18.2c5.4,0,7.4-6.7,9-18.2c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC412.1,300.7,410.1,307.6,404.2,307.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M369.9,303.5c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.4-2-5.7-4.7-7-13.9c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c1.2,8.9,4.4,11.6,6.8,13.5l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.7-1.1,5.5-7.1,6.4-14\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.2-3.8,13.2-6.8,14.4C370.5,303.4,370.2,303.5,369.9,303.5z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M416.2,299.1c-0.4,0-0.8-0.1-1.2-0.4l-0.1-0.1c-1.7-1.4-4-3.3-4.9-9.7c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c0.8,6.2,3.1,8,4.7,9.3l0.1,0.1c0.4,0.3,0.8,0.4,1.3,0.2c1.9-0.7,3.8-4.9,4.4-9.6c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.7,5-2.7,9.2-4.7,10C416.7,299,416.5,299.1,416.2,299.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M361.5,296.2c-0.3,0-0.6-0.1-0.9-0.3l-0.1,0c-1.2-1-2.9-2.3-3.5-6.9c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c0.6,4.3,2.1,5.6,3.3,6.6l0.1,0c0.3,0.2,0.6,0.3,0.9,0.1c1.1-0.4,2.6-2.9,3.1-6.8c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.5,3.6-1.9,6.6-3.4,7.2C361.9,296.1,361.7,296.2,361.5,296.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M411.3,303.5c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.4-2-5.7-4.7-7-13.9c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1-0.1,0.3,0.1,0.3,0.2c1.2,9,4.4,11.6,6.8,13.5l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.7-1.1,5.5-7.1,6.4-14\n\t\t\t\tc0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.2-3.8,13.2-6.8,14.4C411.9,303.4,411.6,303.5,411.3,303.5z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M322.9,310.3c-4.7,0-7.9-6.8-9.9-21.4c0-0.1,0.1-0.3,0.2-0.3c0.2,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14.1,5,20.9,9.3,20.9c4.4,0,7.3-6.6,9.3-20.9c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC330.7,303.5,327.6,310.3,322.9,310.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M316.5,309.5c-4.6,0-7.6-6.5-9.5-20.6c0-0.1,0.1-0.3,0.2-0.3c0.2,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.8,13.5,4.8,20.1,9,20.1c4.2,0,7.1-6.4,9-20.1c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC324.1,302.9,321.1,309.5,316.5,309.5z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M329.3,309.5c-4.6,0-7.6-6.5-9.5-20.6c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.8,13.5,4.8,20.1,9,20.1c4.2,0,7.1-6.4,9-20.1c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC336.9,302.9,333.8,309.5,329.3,309.5z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M310.6,307.3c-0.3,0-0.7,0-1-0.1c-4.7-1.1-8-7.4-9.4-18.3c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.5,10.7,4.6,16.8,9,17.9c1,0.2,2,0.1,2.9-0.5c2.7-1.8,4.7-7.5,6-17.3c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tc-1.4,10-3.4,15.8-6.3,17.7C312.2,307.1,311.4,307.3,310.6,307.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M337.1,307.2c-3.4,0-8-7-9.5-18.4c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2c1.6,11.7,6.2,17.9,9,17.9\n\t\t\t\tc5.4,0,7.4-6.6,9-17.9c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C345,300.5,342.9,307.2,337.1,307.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M302.9,303.2c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.4-1.9-5.7-4.6-6.9-13.6c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c1.2,8.8,4.4,11.4,6.7,13.3l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.7-1.1,5.4-7,6.4-13.7\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7-3.8,13-6.7,14.1C303.6,303.1,303.3,303.2,302.9,303.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M349.1,298.9c-0.4,0-0.8-0.1-1.2-0.4l-0.1-0.1c-1.7-1.4-4-3.2-4.8-9.5c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0.8,6.1,3,7.9,4.6,9.2l0.1,0.1c0.4,0.3,0.9,0.4,1.3,0.2c1.8-0.7,3.7-4.8,4.4-9.4c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.7,4.9-2.7,9.1-4.7,9.9C349.5,298.8,349.3,298.9,349.1,298.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M294.6,296.1c-0.3,0-0.6-0.1-0.9-0.3l-0.1-0.1c-1.2-1-2.9-2.3-3.5-6.8c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0.6,4.3,2.1,5.5,3.3,6.4l0.1,0c0.3,0.2,0.6,0.3,0.9,0.1c1.1-0.4,2.5-2.9,3.1-6.6c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.5,3.5-1.9,6.5-3.4,7.1C295,296,294.8,296.1,294.6,296.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M344.1,303.2c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.4-1.9-5.7-4.6-6.9-13.6c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c1.2,8.8,4.4,11.4,6.7,13.3l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.7-1.1,5.4-7,6.4-13.7\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7-3.8,13-6.7,14.1C344.8,303.1,344.5,303.2,344.1,303.2z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M255.9,310.7c-4.6,0-7.7-6.9-9.6-21.8c0-0.1,0.1-0.3,0.2-0.3c0,0,0,0,0,0c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14.4,4.8,21.4,9.1,21.4c4.3,0,7.2-6.8,9.1-21.4c0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC263.5,304,260.6,310.7,255.9,310.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M249.7,309.9c-4.5,0-7.4-6.7-9.3-21c0-0.1,0.1-0.3,0.2-0.3c0.2-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.8,13.8,4.7,20.5,8.7,20.5c4.1,0,6.9-6.5,8.7-20.5c0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC257,303.4,254.2,309.9,249.7,309.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M262.2,309.9c-4.5,0-7.4-6.7-9.3-21c0-0.1,0.1-0.3,0.2-0.3c0.2-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.8,13.8,4.7,20.5,8.7,20.5c4.1,0,6.9-6.5,8.7-20.5c0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC269.5,303.4,266.6,309.9,262.2,309.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M243.9,307.7c-0.3,0-0.7,0-1-0.1c-4.6-1.1-7.8-7.6-9.2-18.7c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2-0.1,0.3,0.1,0.3,0.2c1.4,10.9,4.5,17.2,8.8,18.3c1,0.3,1.9,0.1,2.7-0.5c2.7-1.8,4.6-7.6,6-17.8c0-0.2,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-1.4,10.3-3.4,16.2-6.2,18.1C245.4,307.5,244.7,307.7,243.9,307.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M269.8,307.6c-3.3,0-7.8-7.2-9.3-18.7c0-0.1,0.1-0.3,0.2-0.3c0.2-0.1,0.3,0.1,0.3,0.2\n\t\t\t\tc1.5,11.9,6.1,18.3,8.7,18.3c5.3,0,7.2-6.7,8.7-18.3c0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC277.5,300.7,275.5,307.6,269.8,307.6z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M236.4,303.5c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.4-2-5.6-4.7-6.8-13.9c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2-0.1,0.3,0.1,0.3,0.2c1.2,9,4.3,11.6,6.6,13.6l0.1,0.1c0.6,0.5,1.2,0.6,1.9,0.4c2.7-1,5.4-7,6.3-14c0-0.2,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-1,7.3-3.8,13.3-6.6,14.5C237,303.4,236.7,303.5,236.4,303.5z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M281.4,299.1c-0.4,0-0.8-0.2-1.2-0.5l-0.1-0.1c-1.6-1.4-3.9-3.3-4.7-9.7c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2-0.1,0.3,0.1,0.3,0.2c0.8,6.2,3,8,4.5,9.3l0.1,0.1c0.4,0.3,0.8,0.4,1.3,0.2c1.8-0.7,3.7-4.8,4.3-9.6c0-0.2,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.7,5.1-2.6,9.3-4.6,10.1C281.9,299.1,281.7,299.1,281.4,299.1z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M228.3,296.2c-0.3,0-0.6-0.1-0.9-0.3l-0.1,0c-1.2-1-2.8-2.4-3.4-6.9c0-0.1,0.1-0.3,0.2-0.3c0,0,0,0,0,0\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c0.6,4.4,2.1,5.7,3.2,6.6l0.1,0c0.3,0.2,0.5,0.3,0.8,0.2c1.1-0.4,2.5-3.1,3-6.8c0-0.2,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.5,3.6-1.9,6.7-3.3,7.2C228.6,296.2,228.5,296.2,228.3,296.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M276.6,303.5c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.4-2-5.6-4.7-6.8-13.9c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2-0.1,0.3,0.1,0.3,0.2c1.2,9,4.3,11.6,6.6,13.6l0.1,0.1c0.6,0.5,1.2,0.6,1.9,0.4c2.7-1,5.4-7,6.3-14c0-0.2,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-1,7.3-3.8,13.3-6.6,14.5C277.2,303.4,276.9,303.5,276.6,303.5z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M189.6,310.2c-4.7,0-7.9-7-9.8-21.3c0-0.1,0.1-0.3,0.2-0.3c0.2,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14,4.9,20.8,9.3,20.8c4.3,0,7.3-6.6,9.3-20.8c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC197.3,303.4,194.2,310.2,189.6,310.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M183.2,309.4c-4.5,0-7.5-6.5-9.5-20.5c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.8,13.5,4.7,20,8.9,20c4.2,0,7-6.4,8.9-20c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C190.7,302.9,187.7,309.4,183.2,309.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M195.9,309.4c-4.5,0-7.6-6.5-9.5-20.5c0-0.1,0.1-0.3,0.2-0.3c0.2,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.8,13.5,4.7,20,8.9,20c4.2,0,7-6.4,8.9-20c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C203.4,302.9,200.4,309.4,195.9,309.4z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M177.3,307.3c-0.3,0-0.7,0-1-0.1c-4.7-1.1-7.9-7.4-9.4-18.3c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.4,10.6,4.5,16.8,9,17.8c1,0.2,2,0.1,2.9-0.5c2.7-1.8,4.6-7.5,6-17.3c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tc-1.4,10-3.4,15.7-6.2,17.7C178.9,307,178.1,307.3,177.3,307.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M203.7,307.2c-3.4,0-7.9-7-9.5-18.3c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.6,11.6,6.2,17.8,8.9,17.8c5.4,0,7.3-6.5,8.9-17.8c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC211.5,300.5,209.5,307.2,203.7,307.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M169.7,303.2c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.4-1.9-5.7-4.6-6.9-13.6c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c1.2,8.8,4.4,11.3,6.7,13.2l0.1,0.1c0.6,0.5,1.3,0.6,2,0.3c2.7-1.1,5.4-6.9,6.3-13.6\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7-3.8,12.9-6.7,14.1C170.4,303.1,170,303.2,169.7,303.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M215.6,298.9c-0.4,0-0.8-0.1-1.2-0.4l-0.1-0.1c-1.7-1.4-4-3.2-4.8-9.5c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0.8,6,3,7.8,4.6,9.1l0.1,0.1c0.4,0.3,0.8,0.4,1.3,0.2c1.8-0.7,3.7-4.8,4.3-9.4c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.7,4.9-2.7,9-4.7,9.8C216,298.8,215.8,298.9,215.6,298.9z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M161.4,296c-0.3,0-0.6-0.1-0.9-0.3l-0.1,0c-1.2-1-2.8-2.3-3.4-6.8c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0.6,4.3,2.1,5.5,3.3,6.4l0.1,0c0.3,0.2,0.6,0.3,0.9,0.1c1.1-0.4,2.5-2.9,3-6.6c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.5,3.5-1.9,6.5-3.4,7C161.8,296,161.6,296,161.4,296z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M210.7,303.2c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.4-1.9-5.7-4.6-6.9-13.6c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c1.2,8.8,4.4,11.3,6.7,13.2l0.1,0.1c0.6,0.5,1.3,0.6,2,0.3c2.7-1.1,5.4-6.9,6.3-13.6\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7-3.8,12.9-6.7,14.1C211.3,303.1,211,303.2,210.7,303.2z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M121.5,311c-4.9,0-8.3-7.2-10.4-22.1c0-0.1,0.1-0.3,0.2-0.3c0.2,0,0.3,0.1,0.3,0.2\n\t\t\t\tc2,14.6,5.3,21.6,9.9,21.6c4.6,0,7.8-6.9,9.9-21.6c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C129.8,304,126.5,311,121.5,311z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M114.8,310.2c-4.8,0-8-7-10-21.3c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2c1.9,14,5.1,20.8,9.5,20.8\n\t\t\t\tc4.5,0,7.5-6.6,9.5-20.8c0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C122.7,303.4,119.5,310.2,114.8,310.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M128.3,310.2c-4.8,0-8-7-10-21.3c0-0.1,0.1-0.3,0.2-0.3c0.2,0,0.3,0.1,0.3,0.2c1.9,14,5.1,20.8,9.5,20.8\n\t\t\t\tc4.5,0,7.5-6.6,9.5-20.8c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C136.2,303.4,133.1,310.2,128.3,310.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M108.5,308c-0.3,0-0.7,0-1.1-0.1c-5-1.1-8.4-7.7-10-19c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.5,11,4.8,17.4,9.6,18.5c1.1,0.3,2.2,0.1,3.1-0.6c2.8-1.9,4.9-7.8,6.3-17.9c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tc-1.5,10.3-3.6,16.2-6.6,18.3C110.2,307.7,109.3,308,108.5,308z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M136.5,307.8c-3.6,0-8.4-7.2-10-19c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.7,12.1,6.6,18.5,9.5,18.5c5.7,0,7.8-6.8,9.5-18.5c0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC144.9,300.9,142.7,307.8,136.5,307.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M100.4,303.7c-0.6,0-1.2-0.2-1.7-0.6l-0.1-0.1c-2.6-2-6-4.8-7.3-14.1c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c1.3,9.1,4.7,11.8,7.1,13.7l0.1,0.1c0.7,0.5,1.4,0.6,2.2,0.3c2.8-1.1,5.7-7.2,6.7-14.2\n\t\t\t\tc0-0.1,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.2-4,13.4-7.1,14.6C101.1,303.6,100.7,303.7,100.4,303.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M149.2,299.2c-0.4,0-0.8-0.2-1.2-0.5l-0.1-0.1c-1.8-1.4-4.2-3.3-5.1-9.8c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0.9,6.3,3.2,8.1,4.9,9.5l0.1,0.1c0.5,0.4,0.9,0.4,1.5,0.2c1.9-0.8,3.9-5,4.6-9.8c0-0.1,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.7,5-2.8,9.3-5,10.2C149.7,299.2,149.4,299.2,149.2,299.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M91.6,296.3c-0.3,0-0.6-0.1-0.9-0.3l-0.1,0c-1.3-1-3-2.4-3.7-7c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c0.6,4.4,2.3,5.7,3.5,6.7l0.1,0c0.3,0.2,0.6,0.3,1,0.1c1.2-0.5,2.7-3,3.2-6.9c0-0.1,0.1-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.5,3.6-2,6.7-3.6,7.3C92,296.2,91.8,296.3,91.6,296.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M144,303.7c-0.6,0-1.2-0.2-1.7-0.6l-0.1-0.1c-2.6-2-6-4.8-7.3-14.1c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.2,0,0.3,0.1,0.3,0.2c1.3,9.1,4.7,11.8,7.1,13.7l0.1,0.1c0.7,0.5,1.4,0.6,2.2,0.3c2.8-1.1,5.7-7.2,6.7-14.2\n\t\t\t\tc0-0.1,0.1-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.2-4,13.4-7.1,14.6C144.7,303.6,144.3,303.7,144,303.7z' fill='#E3AAC3'></path>\n</g>\n<g></g>\n<g>\n<path d='M51.3,311c-4.8,0-8-7-10.1-22.1c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2c2,14.6,5.1,21.6,9.5,21.6\n\t\t\t\tc4.5,0,7.5-6.9,9.5-21.6c0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3C59.3,304,56.1,311,51.3,311z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M44.8,310.2c-4.7,0-7.7-6.8-9.7-21.3c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14,4.9,20.8,9.2,20.8c4.3,0,7.2-6.6,9.2-20.8c0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC52.5,303.4,49.4,310.2,44.8,310.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M57.8,310.2c-4.6,0-7.8-7-9.7-21.3c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.9,14,4.9,20.8,9.2,20.8c4.3,0,7.2-6.6,9.2-20.8c0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC65.5,303.4,62.4,310.2,57.8,310.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M38.7,308c-0.3,0-0.7,0-1-0.1c-4.8-1.1-8.1-7.7-9.6-19c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.5,11,4.7,17.4,9.2,18.5c1.1,0.3,2,0.1,2.9-0.5c2.8-1.9,4.8-7.8,6.2-18c0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tc-1.4,10.4-3.5,16.4-6.4,18.3C40.3,307.7,39.5,308,38.7,308z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M65.8,307.8c-3.4,0-8.1-7.2-9.7-19c0-0.1,0.1-0.3,0.2-0.3c0.1,0,0.3,0.1,0.3,0.2\n\t\t\t\tc1.6,12.1,6.4,18.5,9.2,18.5c5.5,0,7.5-6.8,9.2-18.5c0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3\n\t\t\t\tC73.8,300.9,71.7,307.8,65.8,307.8z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M30.9,303.7c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.5-2-5.8-4.8-7.1-14.1c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c1.2,9.1,4.5,11.8,6.9,13.7l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.8-1.1,5.6-7.2,6.5-14.2\n\t\t\t\tc0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.3-3.9,13.4-6.9,14.6C31.6,303.6,31.2,303.7,30.9,303.7z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M78,299.2c-0.4,0-0.8-0.2-1.2-0.5l-0.1-0.1c-1.7-1.4-4.1-3.3-4.9-9.8c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c0.8,6.3,3.1,8.1,4.7,9.5l0.1,0.1c0.4,0.3,0.9,0.4,1.4,0.2c1.9-0.7,3.8-4.9,4.5-9.8c0-0.2,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.7,5.1-2.7,9.4-4.8,10.2C78.5,299.2,78.2,299.2,78,299.2z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M22.4,296.3c-0.3,0-0.6-0.1-0.9-0.3l-0.1,0c-1.2-1-2.9-2.4-3.5-7c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c0.6,4.4,2.2,5.7,3.3,6.7l0.1,0c0.3,0.2,0.6,0.3,0.9,0.1c1.1-0.4,2.6-3,3.1-6.9c0-0.2,0.2-0.3,0.3-0.2\n\t\t\t\tc0.1,0,0.3,0.2,0.2,0.3c-0.5,3.6-2,6.7-3.5,7.3C22.8,296.3,22.6,296.3,22.4,296.3z' fill='#E3AAC3'></path>\n</g>\n<g>\n<path d='M73,303.7c-0.6,0-1.1-0.2-1.6-0.6l-0.1-0.1c-2.5-2-5.8-4.8-7.1-14.1c0-0.1,0.1-0.3,0.2-0.3\n\t\t\t\tc0.1,0,0.3,0.1,0.3,0.2c1.2,9.1,4.5,11.8,6.9,13.7l0.1,0.1c0.6,0.5,1.3,0.6,2.1,0.3c2.8-1.1,5.6-7.2,6.5-14.2\n\t\t\t\tc0-0.2,0.2-0.3,0.3-0.2c0.1,0,0.3,0.2,0.2,0.3c-1,7.3-3.9,13.4-6.9,14.6C73.6,303.6,73.3,303.7,73,303.7z' fill='#E3AAC3'></path>\n</g>\n</svg>\n</div>\n</div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(window.HAML.context(context));
  };

}).call(this);

define("backbone/templates/rental_agreements/_preview_form", function(){});

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define('backbone/views/rental_agreements/preview',['backbone/assets', 'backbone/helpers/rental_agreements/string_formatter', 'backbone/templates/rental_agreements/_preview_form'], function(Housing, RAStringFormatter) {
    var Preview;
    return Preview = (function(superClass) {
      extend(Preview, superClass);

      function Preview() {
        this.destroy = bind(this.destroy, this);
        this.show_repeatable_dependent = bind(this.show_repeatable_dependent, this);
        this.delete_repeatable = bind(this.delete_repeatable, this);
        this.create_new_repeatable = bind(this.create_new_repeatable, this);
        this.set_answer = bind(this.set_answer, this);
        this.get_formatted_answer = bind(this.get_formatted_answer, this);
        this.set_variable_rent = bind(this.set_variable_rent, this);
        this.init_question = bind(this.init_question, this);
        this.get_blank_field = bind(this.get_blank_field, this);
        this.render = bind(this.render, this);
        this.initialize = bind(this.initialize, this);
        return Preview.__super__.constructor.apply(this, arguments);
      }

      Preview.prototype.el = '#ra-preview';

      Preview.prototype.initialize = function(options) {
        return this.render();
      };

      Preview.prototype.template = {
        preview: window.JST['rental_agreements/preview_form']
      };

      Preview.prototype.render = function() {
        var city_field_selector, diff_id, j, k, l, len, len1, len2, len3, len4, len5, m, n, o, question, ref, ref1, ref2, ref3, ref4, ref5, section, step;
        this.$preview_inner = $(this.template.preview());
        this.$preview_inner.append(Housing.RentalAgreement.data.agreement.template_content);
        ref = Housing.RentalAgreement.sorted_steps;
        for (j = 0, len = ref.length; j < len; j++) {
          step = ref[j];
          ref1 = step.agreement_step_sections;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            section = ref1[k];
            if (section.is_repeatable) {
              ref2 = section.agreement_step_section_questions;
              for (l = 0, len2 = ref2.length; l < len2; l++) {
                question = ref2[l];
                this.init_question(section.id, null, question);
              }
              ref3 = section.diffs;
              for (m = 0, len3 = ref3.length; m < len3; m++) {
                diff_id = ref3[m];
                this.create_new_repeatable(section.id, diff_id, this.$preview_inner);
                ref4 = section.agreement_step_section_questions;
                for (n = 0, len4 = ref4.length; n < len4; n++) {
                  question = ref4[n];
                  if (question.answer_diff[diff_id]) {
                    this.set_answer(section.id, diff_id, question);
                  }
                }
              }
            } else {
              ref5 = section.agreement_step_section_questions;
              for (o = 0, len5 = ref5.length; o < len5; o++) {
                question = ref5[o];
                if (question.tag === 'City') {
                  city_field_selector = this.get_blank_field(section.id, null, question, false);
                }
                this.init_question(section.id, null, question);
                if (question.answer) {
                  this.set_answer(section.id, null, question);
                }
              }
            }
          }
        }
        this.$preview_inner.find('.current.ans-field').removeClass('current').addClass('reached');
        this.$preview_inner.find('.cond.highlight').removeClass('highlight');
        this.$el.prepend(this.$preview_inner);
        this.forced = true;
        this.header_height = $('#header').height();
        return this.show_till($(city_field_selector + ':first'));
      };

      Preview.prototype.get_blank_field = function(section_id, diff_id, question, inner) {
        var selector;
        if (inner == null) {
          inner = true;
        }
        selector = '.ans-field[data-ssq="' + question.id + '"]';
        if (inner) {
          selector += ' .ans-blank';
        }
        if (diff_id) {
          selector = '.cloned[data-ss="' + section_id + '"][data-diff="' + diff_id + '"] ' + selector;
        }
        return selector;
      };

      Preview.prototype.init_question = function(section_id, diff_id, question) {
        var $ans_field;
        $ans_field = this.$preview_inner.find(this.get_blank_field(section_id, null, question, false));
        $ans_field.addClass('unanswered');
        if (question.is_mandatory) {
          return $ans_field.addClass('mandatory');
        }
      };

      Preview.prototype.set_variable_rent = function() {
        var $field, count, duration, duration_q, i, j, last_rent, months, months_q, percent, percent_q, ref, ref1, rent, rent_q, str, temp, tex;
        rent_q = Housing.RentalAgreement.questions_by_tags.monthly_rent_fees;
        percent_q = Housing.RentalAgreement.questions_by_tags.increment_rate_fees;
        months_q = Housing.RentalAgreement.questions_by_tags.months_incr;
        duration_q = Housing.RentalAgreement.questions_by_tags.duration_months_fees;
        if (!(rent_q && percent_q && months_q && duration_q)) {
          return;
        }
        $field = $(this.get_blank_field(null, null, percent_q, false));
        if (!$field) {
          return;
        }
        rent = Number(rent_q.answer);
        percent = Number(percent_q.answer);
        months = parseInt(months_q.answer);
        duration = parseInt(duration_q.answer);
        if (!(rent && percent && months && duration)) {
          $field.empty();
          return;
        }
        if ('SPAN' === $field.prop('tagName')) {
          $field.replaceWith('<div class="ans-field" data-ssq="' + percent_q.id + '"></div>');
          $field = $(this.get_blank_field(null, null, percent_q, false));
          if (!$field) {
            return;
          }
        }
        count = 0;
        str = '<div class="olist">';
        last_rent = rent;
        for (i = j = 0, ref = duration, ref1 = months; ref1 > 0 ? j < ref : j > ref; i = j += ref1) {
          count += months;
          if (i) {
            tex = 'next';
          } else {
            tex = 'first';
          }
          if (count > duration) {
            months -= count - duration;
          }
          str += '<div class="litem sec">';
          temp = 'Rs. ' + last_rent.toFixed(2) + '/- for the ' + tex + ' ' + months + ' month';
          temp += months > 1 ? 's,' : ',';
          str += temp;
          str += '</div>';
          last_rent *= 1 + (percent / 100);
        }
        str += '</div>';
        return $field.html(str);
      };

      Preview.prototype.get_formatted_answer = function(question, diff_id) {
        var $field, answer, duration, duration_q, end_date, end_date_str, ref, splits, start_date, start_date_q;
        answer = '';
        if (diff_id) {
          answer = RAStringFormatter.unescape(question.answer_diff[diff_id]);
        } else {
          answer = RAStringFormatter.unescape(question.answer);
        }
        if (!answer) {
          answer = '';
        }
        switch (question.question_type_name) {
          case 'Day of Month':
            if (answer.match(/^0*([0-9]|[12][0-9]|30)$/)) {
              answer = RAStringFormatter.get_ordinal(answer);
            }
            break;
          case 'Date':
            if (answer.match(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/\d{4}$/)) {
              answer = RAStringFormatter.date_to_string(answer);
            }
            break;
          case 'Numeric':
            if (!answer) {
              answer = '0';
            }
            break;
          default:
            switch (question.formatting) {
              case 'Uppercase':
                answer = answer.toUpperCase();
                break;
              case 'CommaSeperated':
                if (!answer) {
                  answer = '0';
                }
                answer = Housing.Util.comma_formatted(answer);
                break;
              case 'CommaSeperatedAndWords':
                if (!answer) {
                  answer = '0';
                }
                answer = Housing.Util.comma_formatted(answer) + ' (' + RAStringFormatter.num_to_string(answer) + ')';
            }
        }
        if (question.formatting === 'Duration') {
          if ((start_date_q = Housing.RentalAgreement.questions_by_tags['StartDate']) && (duration_q = Housing.RentalAgreement.questions_by_tags['duration_months_fees'])) {
            start_date = start_date_q.answer;
            duration = duration_q.answer;
          }
          if (start_date && duration) {
            duration = parseInt(duration);
            splits = start_date.split('/');
            end_date = new Date(parseInt(splits[2]), parseInt(splits[1]) - 1, parseInt(splits[0]));
            end_date.setMonth(end_date.getMonth() + duration);
            end_date.setDate(end_date.getDate() - 1);
            end_date_str = RAStringFormatter.date_to_string(end_date.getDate() + '/' + (end_date.getMonth() + 1) + '/' + end_date.getFullYear());
            this.$preview_inner.find('.ans-field[data-ssq="EndDate"] .ans-blank').text(end_date_str).parent().addClass('current');
          }
        }
        if ((ref = question.tag) === 'monthly_rent_fees' || ref === 'increment_rate_fees' || ref === 'months_incr' || ref === 'duration_months_fees') {
          $field = this.set_variable_rent();
          if ($field && !(question.tag === 'duration_months_fees')) {
            this.show_till($field);
          }
        }
        return answer;
      };

      Preview.prototype.set_answer = function(section_id, diff_id, question, dont_scroll) {
        var $ans_field, $row, $slave, $slaves, ans_field_found, answer, cond, custom_name, custom_num, custom_rows, j, len, selector, slave;
        if (question.question_type_name === 'Furnishing') {
          if (question.tag === 'CustomNumeric') {
            this.$preview_inner.find('tr.custom').remove();
            answer = {};
            if (question.answer) {
              answer = JSON.parse(RAStringFormatter.unescape(question.answer));
            }
            custom_rows = '';
            for (custom_name in answer) {
              custom_num = answer[custom_name];
              if (custom_name) {
                custom_rows += '<tr class="custom"><td>' + custom_name + '</td><td class="count">' + custom_num + '</td></tr>';
              }
            }
            this.$preview_inner.find('table:last').append(custom_rows);
            this.show_till(this.$preview_inner.find('table:last'));
            return;
          }
          $row = this.$preview_inner.find('tr[data-furnishing="' + question.id + '"]');
          if ($row.length) {
            if (question.answer && question.answer !== '0') {
              $row.find('.count').text(question.answer);
              this.show_till($row);
            } else {
              $row.remove();
              return;
            }
          } else if (question.answer && question.answer !== '0') {
            $row = $('<tr data-furnishing="' + question.id + '"><td>' + question.name + '</td><td class="count">' + question.answer + '</td></tr>');
            this.$preview_inner.find('table:last').append($row);
            this.show_till($row);
          }
          return;
        }
        ans_field_found = false;
        answer = this.get_formatted_answer(question, diff_id);
        $ans_field = this.$preview_inner.find(this.get_blank_field(section_id, diff_id, question));
        if ($ans_field.length) {
          $ans_field.text(answer);
          $ans_field = $ans_field.parent();
          if (answer) {
            $ans_field.removeClass('unanswered');
          } else {
            $ans_field.addClass('unanswered');
          }
          ans_field_found = true;
          if ((answer !== question.default_answer) || this.forced) {
            if ($ans_field.length > 1) {
              $ans_field = this.$preview_inner.find((this.get_blank_field(section_id, diff_id, question, false)) + ':first');
            }
            if (!dont_scroll) {
              this.show_till($ans_field);
            }
          }
        }
        selector = '.cond[data-mstr=' + question.id + ']';
        if (diff_id) {
          selector = '.cloned[data-ss="' + section_id + '"][data-diff="' + diff_id + '"] ' + selector;
        }
        this.$preview_inner.find('.cond.highlight').removeClass('highlight');
        $slaves = this.$preview_inner.find(selector);
        $slaves.removeClass('shown');
        for (j = 0, len = $slaves.length; j < len; j++) {
          slave = $slaves[j];
          $slave = $(slave);
          cond = $slave.data('cond');
          if (cond === '==' + answer) {
            $slave.addClass('shown highlight');
          } else if ((cond.indexOf('!=') === 0) && (cond !== '!=' + answer)) {
            $slave.addClass('shown highlight');
          }
          if ($slave.closest('.reached').length) {
            while (!$slave.is('.ra-preview-inner')) {
              $slave.addClass('reached');
              $slave = $slave.parent();
            }
          }
        }
        if (!ans_field_found && ((answer !== question.default_answer) || this.forced) && $slaves.length) {
          if ($slaves.length > 1) {
            $slaves = this.$preview_inner.find(selector + '[data-cond="==' + answer + '"]:first');
          }
          if ($slaves.length) {
            if (!dont_scroll) {
              return this.show_till($slaves);
            }
          }
        }
      };

      Preview.prototype.show_till = function($ans_field) {
        var $orig_ans_field, $temp;
        this.$preview_inner.find('tr.current').removeClass('current');
        $temp = this.$preview_inner.find('.current.ans-field');
        if (!$temp.is($ans_field)) {
          $temp.addClass('reached').removeClass('current');
        }
        $orig_ans_field = $ans_field;
        while (!$ans_field.is('.ra-preview-inner')) {
          $ans_field.addClass('current');
          $ans_field.prevAll().addClass('reached').removeClass('current');
          $ans_field = $ans_field.parent();
          if (!$ans_field.length) {
            break;
          }
        }
        if (this.forced && $orig_ans_field.is(':visible')) {
          setTimeout((function(_this) {
            return function() {
              var canvas_height, current_offset, from_top, height, to_offset, to_top;
              height = parseInt($orig_ans_field.height());
              current_offset = parseInt($orig_ans_field.position().top);
              $orig_ans_field = $orig_ans_field.offsetParent();
              if ($orig_ans_field.closest('.ra-preview-inner').length) {
                while (!$orig_ans_field.is('.ra-preview-inner')) {
                  current_offset += parseInt($orig_ans_field.position().top);
                  $orig_ans_field = $orig_ans_field.offsetParent();
                }
              }
              canvas_height = window.innerHeight - _this.header_height;
              to_offset = parseInt((canvas_height - height) / 2);
              to_top = parseInt(to_offset - current_offset);
              from_top = Math.max(_this.$preview_inner.offset().top - _this.header_height - 20 - $(window).scrollTop(), 0);
              to_top = from_top > 0 ? to_top - from_top : to_top;
              return _this.$preview_inner.css('top', to_top + 'px');
            };
          })(this), 0);
        }
        return true;
      };

      Preview.prototype.create_new_repeatable = function(section_id, diff_id) {
        var $rep_blocks;
        $rep_blocks = this.$preview_inner.find('.rep-block:not(.cloned)[data-ss="' + section_id + '"]');
        $rep_blocks.each(function(i, rep_block) {
          var $rep_block, $rep_block_clone;
          $rep_block = $(rep_block);
          $rep_block_clone = $rep_block.clone();
          return $rep_block_clone.addClass('cloned').attr('data-diff', diff_id).insertBefore($rep_block);
        });
        return this.show_repeatable_dependent(section_id);
      };

      Preview.prototype.delete_repeatable = function(section_id, diff_id) {
        this.$el.find('.rep-block.cloned[data-ss="' + section_id + '"][data-diff="' + diff_id + '"]').remove();
        return this.show_repeatable_dependent(section_id);
      };

      Preview.prototype.show_repeatable_dependent = function(section_id) {
        var $plural, $singular, count, original_count;
        $singular = this.$preview_inner.find('.cond[data-mstr="rep-' + section_id + '"][data-cond="==1"]');
        $plural = this.$preview_inner.find('.cond[data-mstr="rep-' + section_id + '"][data-cond="!=1"]');
        count = this.$preview_inner.find('.rep-block.cloned[data-ss="' + section_id + '"]').length;
        original_count = this.$preview_inner.find('.rep-block:not(.cloned)[data-ss="' + section_id + '"]').length;
        if ((count / original_count) === 1) {
          $singular.addClass('shown');
          return $plural.removeClass('shown');
        } else {
          $plural.addClass('shown');
          return $singular.removeClass('shown');
        }
      };

      Preview.prototype.destroy = function() {
        return this.stopListening();
      };

      return Preview;

    })(Backbone.View);
  });

}).call(this);

(function() {
  if (window.JST == null) {
    window.JST = {};
  }

  window.JST['components/confirm_modal'] = function(context) {
    return (function() {
      var $c, $e, $o;
      $e = window.HAML.escape;
      $c = window.HAML.cleanValue;
      $o = [];
      $o.push("<div class='confirm-modal modal'>\n<div class='modal-close'>\n<span class='icon-close'></span>\n</div>\n<div class='modal-message'>\n<span>" + ($e($c(this.message))) + "</span>\n</div>\n<a class='btn modal-confirm primary'>" + ($e($c(this.confirm))) + "</a>\n<a class='bordered btn modal-cancel primary'>" + ($e($c(this.cancel))) + "</a>\n</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(window.HAML.context(context));
  };

}).call(this);

define("backbone/templates/components/_confirm_modal", function(){});


/*
	Options:
		Callbacks:
			options.onconfirm: called on confirmation
			options.oncancel: called on cancellation
			options.onclose: called on closing (clicking the close button)
		Modal Behaviour:
			options.modal: Object for modal behaviour(Check in bootstrap/modal.js.coffee)
		Modal text:
			options.text:
				{
					confirm: Text for confirm button
					cancel: Text for cancel button
					message: Modal message text
				}

	Defaults:
		options.modal ---- Behaviour:
			Check modal defaults in bootstrap/modal.js.coffee

		options.text --- Modal Text:
			confirm: 'Confirm'
			cancel: 'Cancel'
			message: 'Are you sure?'

	Usage:
		new ConfirmationModal
			onconfirm: confirm_callback
			oncancel: cancel_callback
			onclose: close_callback
			[modal: modal_options_object]
			[text: modal_text_object]

	NOTE: import CSS 'website/components/confirm_modal/confirm_modal'
 */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define('backbone/views/components/confirmation_modal',['backbone/assets', 'backbone/templates/components/_confirm_modal'], function(Housing) {
    var ConfirmationModal;
    ConfirmationModal = (function(superClass) {
      extend(ConfirmationModal, superClass);

      function ConfirmationModal() {
        this.destroy = bind(this.destroy, this);
        this.oncancel = bind(this.oncancel, this);
        this.onconfirm = bind(this.onconfirm, this);
        this.onclose = bind(this.onclose, this);
        this.close_modal = bind(this.close_modal, this);
        this.initialize = bind(this.initialize, this);
        return ConfirmationModal.__super__.constructor.apply(this, arguments);
      }

      ConfirmationModal.prototype.template = window.JST['components/confirm_modal'];

      ConfirmationModal.prototype.defaults = {
        confirm: 'Confirm',
        cancel: 'Cancel',
        message: 'Are you sure?'
      };

      ConfirmationModal.prototype.initialize = function(options) {
        var $modal_container, $parent, data;
        this.options = options;
        data = _.extend(this.defaults, options.text);
        $parent = $('#modal-container');
        $modal_container = $(this.template(data));
        $parent.append($modal_container);
        if (this.options.modal) {
          this.hiddenCallback = this.options.modal.hiddenCallback;
        }
        _.extend(this.options.modal, {
          hiddenCallback: this.onclose
        });
        this.modal = $modal_container.modal(this.options.modal);
        return this.modal.on('click', '.modal-confirm', this.onconfirm).on('click', '.modal-cancel', this.oncancel).on('click', '.modal-close', this.onclose);
      };

      ConfirmationModal.prototype.close_modal = function() {
        if (this.modal) {
          this.modal.modal('hide');
        }
        return this.destroy();
      };

      ConfirmationModal.prototype.onclose = function(e) {
        if (this.hiddenCallback) {
          this.hiddenCallback();
        }
        if (this.options.onclose) {
          this.options.onclose();
        }
        return this.close_modal();
      };

      ConfirmationModal.prototype.onconfirm = function(e) {
        this.close_modal();
        if (this.options.onconfirm) {
          return this.options.onconfirm();
        }
      };

      ConfirmationModal.prototype.oncancel = function(e) {
        this.close_modal();
        if (this.options.oncancel) {
          return this.options.oncancel();
        }
      };

      ConfirmationModal.prototype.destroy = function() {
        this.stopListening();
        if (this.modal) {
          this.modal.remove();
        }
        return this.modal = null;
      };

      return ConfirmationModal;

    })(Backbone.View);
    return ConfirmationModal;
  });

}).call(this);

(function() {
  define('backbone/helpers/keyspy',[], function() {
    var keyspy;
    keyspy = function(options) {
      this.options = options || {};
      this.listeners = [];
      this.on($(window), 'focusin', this.focus_interceptor);
      this.on($(window), 'keydown', this.key_prevent);
      return this.on($(window), 'keyup', this.key_allow);
    };
    keyspy.prototype = {
      KEY_MAP: {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        TAB: 9,
        ONE: 49,
        NINE: 57,
        ENTER: 13,
        SPACE: 32
      },
      on: function(target, event, handler) {
        var proxy;
        proxy = $.proxy(handler, this);
        target.on(event, proxy);
        return this.listeners.push([target, event, proxy]);
      },
      bye: function() {
        this.listeners.forEach(function(o) {
          return o[0].off(o[1], o[2]);
        });
        return this.listeners = [];
      },
      is_radio_focused: function() {
        return this.target && this.target.type === 'radio';
      },
      is_checkbox_focused: function() {
        return this.target && this.target.type === 'checkbox';
      },
      is_numeric_focused: function() {
        return this.target && $(this.target).hasClass('numeric');
      },
      vertical_criterion: function() {
        if (typeof this.options.vertical_criterion === 'function') {
          return this.options.vertical_criterion();
        }
      },
      focus_interceptor: function(e) {
        if ($(e.target).hasClass('input')) {
          return this.target = e.target;
        }
      },
      key_allow: function() {
        return this.keydown = false;
      },
      key_prevent: function(e) {
        var key;
        this.keydown = true;
        key = e.which;
        if ((key === this.KEY_MAP.TAB) || (key === this.KEY_MAP.UP) || (key === this.KEY_MAP.DOWN) || this.is_radio_focused() && ((key === this.KEY_MAP.LEFT) || (key === this.KEY_MAP.RIGHT))) {
          e.preventDefault();
        }
        return this.key_interceptor(e);
      },
      key_interceptor: function(e) {
        var $target, checkbox, key, radio, target_direction, target_type, val;
        key = e.which;
        if (key === this.KEY_MAP.TAB) {
          if (e.shiftKey) {
            return this.prev_element('tab');
          } else {
            return this.select_element(null, true, 'tab');
          }
        } else if (key === this.KEY_MAP.ENTER) {
          return this.select_element(null, true, 'enter');
        } else {
          radio = this.is_radio_focused();
          checkbox = this.is_checkbox_focused();
          if (key === this.KEY_MAP.UP) {
            target_direction = 'prev';
          } else if (key === this.KEY_MAP.DOWN) {
            target_direction = 'next';
          }
          if (!target_direction && (radio || checkbox) && !this.vertical_criterion()) {
            if (key === this.KEY_MAP.LEFT) {
              target_direction = 'prev';
            }
            if (key === this.KEY_MAP.RIGHT) {
              target_direction = 'next';
            }
          }
          if (target_direction) {
            target_type = radio || checkbox ? 'sibling' : 'element';
            return this[target_direction + '_' + target_type]('arrow');
          } else if (this.is_numeric_focused()) {
            if (key === this.KEY_MAP.RIGHT || key === this.KEY_MAP.LEFT) {
              $target = $(this.target);
              val = parseInt($target.val()) || 0;
              val = val + (key - this.KEY_MAP.UP);
              if (val < 0) {
                val = 0;
              }
              $target.val(val);
              return this.select_element(null, false, 'arrow');
            }
          } else if (radio) {
            if ((key >= this.KEY_MAP.ONE) && (key <= this.KEY_MAP.NINE)) {
              this.select_element(key - this.KEY_MAP.ONE, true, 'key');
              return false;
            }
          } else if (checkbox) {
            if (key === this.KEY_MAP.SPACE) {
              this.select_element(null, false, 'space');
              return false;
            }
            if ((key >= this.KEY_MAP.ONE) && (key <= this.KEY_MAP.NINE)) {
              this.select_element(key - this.KEY_MAP.ONE, false, 'key');
              return false;
            }
          }
        }
      },
      traverse_sibling: function(deltaIndex, mode) {
        var el, index, newEl, newIndex, sibs;
        el = this.target;
        if (el) {
          sibs = $(el.parentNode).children('.input');
          if (sibs.length) {
            index = sibs.index(el);
            newIndex = index + deltaIndex;
            if (newIndex < 0) {
              return this.prev_element(mode);
            } else if (newIndex < sibs.length) {
              newEl = sibs.eq(newIndex);
              return newEl.focus();
            } else {
              return this.next_element(mode);
            }
          }
        }
      },
      traverse_element: function(delta, mode) {
        var checked, el, form_element, index, input, inputs, parent, sib, sibs;
        el = this.target;
        if (el) {
          form_element = $(el).closest('.form-element');
          parent = this.options.parent ? form_element.closest(this.options.parent) : form_element.parent();
          if (parent.length) {
            sibs = parent.find('.form-element:visible:not(.collapsed):not(.disabled)');
            index = delta + sibs.index(form_element);
            if ((index >= 0) && (index < sibs.length)) {
              sib = $(sibs[index]);
              if (sib.length) {
                inputs = sib.find('.input');
                if (inputs.length) {
                  checked = inputs.filter(':checked');
                  if (checked.length) {
                    inputs = checked;
                  }
                  if (delta === -1 && inputs.length) {
                    input = inputs.eq(-1);
                  } else {
                    input = inputs.eq(0);
                  }
                  if (typeof this.options.focus_question === 'function') {
                    return this.options.focus_question.call(this, input, this.target, delta, mode);
                  }
                }
              }
            } else {
              if (typeof this.options.on_out_of_range === 'function') {
                return this.options.on_out_of_range.call(this, delta);
              }
            }
          }
        }
      },
      prev_sibling: function(mode) {
        return this.traverse_sibling(-1, mode);
      },
      next_sibling: function(mode) {
        return this.traverse_sibling(1, mode);
      },
      prev_element: function(mode) {
        return this.traverse_element(-1, mode);
      },
      next_element: function(mode) {
        return this.traverse_element(1, mode);
      },
      select_element: function(index, next, mode) {
        var checkbox, el, goto_next, radio;
        if (next == null) {
          next = true;
        }
        el = this.target;
        if (el) {
          if (typeof index === 'number') {
            el = $(el).parent().children('.input').eq(index);
            if (!el.length) {
              return;
            }
          } else {
            el = $(el).parent().children('.input:focus');
          }
          checkbox = this.is_checkbox_focused();
          radio = this.is_radio_focused();
          if (checkbox) {
            if (!next) {
              el.prop('checked', !el.prop('checked'));
            }
          } else if (radio) {
            el.prop('checked', true);
          }
          if (!next) {
            el.focus();
          }
          if ((radio || checkbox) && typeof this.options.onchange === 'function') {
            goto_next = this.options.onchange.call(this, {
              target: el,
              mode: mode
            });
            if (!goto_next) {
              return;
            }
          }
          if (next) {
            return this.next_element(mode);
          }
        }
      }
    };
    return keyspy;
  });

}).call(this);

(function() {
  define('backbone/helpers/smarty',['backbone/assets', 'templates/context'], function(Housing) {
    var Smarty;
    Housing.validations = window.HAML.globals();
    Smarty = function(element, options) {
      this.element = element;
      this.options = $.extend({
        onfocus: null,
        onblur: null,
        select_key: true,
        mature: true,
        refreshMaturity: true,
        tooltips: true
      }, options);
      this.listeners = [];
      this.common_events();
      this.dull_dropdowns = [];
      this.types = {
        select: {
          selector: '[type=select]'
        },
        numeric: {
          selector: '.numeric'
        }
      };
      this.refresh();
      return this;
    };
    $.fn.smarty = function(options, target) {
      return this.each(function() {
        var data, el;
        el = $(this);
        data = el.data('smarty');
        if (typeof options === 'string') {
          if (data) {
            return data[options]({
              target: target
            });
          }
        } else if (data) {
          return data.refresh();
        } else {
          options = $.extend($.fn.smarty.defaults, typeof options === 'object' && options);
          data = new Smarty(el, options);
          el.data('smarty', data);
          return data;
        }
      });
    };
    return Smarty.prototype = {
      common_events: function() {
        this.on('focus', this.focus, true);
        this.on('blur', this.blur, true);
        this.on('input', this.input, true);
        this.on('change', this.change, true);
        this.on('click', '.form-element', this.intercept_click);
        return this.on('mouseover', '.input-helper', function(e) {
          return $(e.currentTarget).hide();
        });
      },
      other_events: function() {
        var elements, object, ref, results, type;
        elements = this.element.find('.form-element > .input');
        ref = this.types;
        results = [];
        for (type in ref) {
          object = ref[type];
          if (!object.present) {
            if (!(elements.filter(object.selector).length || this.options[type + '_events'])) {
              continue;
            }
            object.present = true;
            results.push(this[type + '_events']());
          } else {
            results.push(void 0);
          }
        }
        return results;
      },
      select_events: function() {
        this.on('click', '.input[type=select]', this.select_reveal);
        this.on('mouseover', '.option', this.select_hover);
        this.on('click', '.option', this.select_option);
        this.on('mousedown', '.select', this.select_down);
        if (this.options.select_key) {
          this.on('keydown', 'input[type=select]', (function(e) {
            if ([13, 38, 40].indexOf(e.which) !== -1) {
              return e.preventDefault();
            }
          }));
          return this.on('keyup', 'input[type=select]', this.select_key);
        }
      },
      numeric_events: function() {
        this.on('click', '.plus-btn', this.numeric_plus);
        return this.on('click', '.minus-btn', this.numeric_minus);
      },
      focus: function(e) {
        var parent;
        parent = this.get_parent($(e.target.parentNode));
        parent.addClass('focused');
        if (e.relatedTarget && typeof e.target.getAttribute('autoreveal') === 'string' && 'select' === e.target.getAttribute('type')) {
          parent.addClass('open');
        }
        if (typeof this.options.onfocus === 'function') {
          return this.options.onfocus.call(this, e);
        }
      },
      intercept_click: function(e) {
        if (!/input/.test(e.target.className)) {
          return $(e.currentTarget).children('.input').focus();
        }
      },
      blur: function(e) {
        var $el, classname, parent;
        if (this.selectdown) {
          return;
        }
        this.input(e);
        $el = $(e.target);
        parent = this.get_parent($(e.target.parentNode));
        classname = 'focused';
        if (parent.hasClass('open')) {
          classname += ' open';
        }
        parent.removeClass(classname);
        setTimeout((function(_this) {
          return function() {
            if (_this.options.mature && !parent.hasClass('focused') && $el.val() && $el.val().length) {
              return parent.addClass('mature');
            }
          };
        })(this), 50);
        if (typeof this.options.onblur === 'function') {
          return this.options.onblur.call(this, e);
        }
      },
      input: function(e) {
        var $el, el, invalidity, key, key_validity, multiline, parent, pattern, ref, required, type, valid, value;
        el = e.target;
        $el = $(el);
        parent = this.get_parent($(el.parentNode));
        type = el.getAttribute('type');
        if (/checkbox|radio/.test(type)) {
          if (el.required) {
            if (parent[0].querySelector('.input:checked')) {
              parent.removeClass('invalid');
            } else {
              parent.addClass('invalid');
            }
          }
          return;
        }
        value = $el.val();
        required = $el.prop('required');
        if (el.readOnly) {
          valid = value || !required;
        } else if (el.validity) {
          valid = el.validity.valid;
          if (!valid) {
            invalidity = true;
            ref = el.validity;
            for (key in ref) {
              key_validity = ref[key];
              if ((key !== 'valid') && (key !== 'valueMissing') && key_validity) {
                invalidity = false;
                break;
              }
            }
            valid = invalidity && !required;
          }
        } else {
          valid = true;
          pattern = el.pattern;
          if (required && !value) {
            valid = false;
          }
          if (valid && pattern) {
            valid = new RegExp(pattern).test(value);
          }
        }
        if (valid && parent.hasClass('invalid')) {
          parent.removeClass('invalid');
        } else if (!valid) {
          parent.addClass('invalid');
        }
        if (value && !parent.hasClass('filled')) {
          parent.addClass('filled');
          if (this.options.tooltips) {
            parent.find('.helper-text').html(this.helptext(el));
          }
        } else if (!(value || el.getAttribute('placeholder'))) {
          if ($(el).attr('country-code') === 'true' && !($(el).attr('no-prefill') === 'true')) {
            parent.addClass('filled');
          } else {
            parent.removeClass('filled');
          }
          if (this.options.tooltips) {
            parent.find('.helper-text').html(this.helptext(el));
          }
        } else if (!value && this.options.ignorePlaceholder) {
          parent.removeClass('filled');
          if (this.options.tooltips) {
            parent.find('.helper-text').html(this.helptext(el));
          }
        }
        if ((el.tagName === 'TEXTAREA') && (typeof el.getAttribute('changeheight' === 'string'))) {
          multiline = /\n/.test(value);
          if (!multiline && parent.hasClass('multiline')) {
            return parent.removeClass('multiline');
          } else if (multiline) {
            return parent.addClass('multiline');
          }
        }
      },
      helptext: function(el) {
        var helptext, type, value;
        type = el.getAttribute('type');
        value = el.value;
        helptext = el.getAttribute('data-helptext');
        if (helptext) {
          return helptext;
        } else if (type === 'select') {
          return 'Please select an item in the list.';
        } else if (!value) {
          return 'Please fill out this field.';
        } else if (type === 'tel') {
          return 'Please enter a valid phone number.';
        } else if (type === 'name') {
          return 'Please enter valid name, like Rajesh Kumar';
        } else if (type === 'email') {
          return 'Please enter valid email address, like you@example.com';
        } else if (type === 'ccexp') {
          return 'Please enter valid expiry date, like 11/17';
        } else if (type === 'zip') {
          return 'Please enter valid zip code, like 400072';
        } else if (type === 'otp') {
          return 'Please enter a valid OTP.';
        } else {
          return 'Please enter valid input.';
        }
      },
      validations: {
        name: Housing.validations.name_validation_pattern,
        email: Housing.validations.email_validation_pattern,
        phone: Housing.validations.phone_validation_pattern,
        creditcard: '^([0-9]{4} ){3}[0-9]{4}$',
        zip: '^[0-9]{6}$',
        ccexp: '^[0-9]{2}\/[0-9]{2}$',
        otp: '^[0-9]{4}$'
      },
      change: function(e) {
        var $el, el, type, value;
        el = e.target;
        type = el.type;
        if (type === 'radio') {
          el.checked = true;
        }
        $el = $(el);
        value = $el.val();
        $el.attr('data-length', value.length);
        if (el.options && (el.selectedIndex != null) && el.options[el.selectedIndex]) {
          $el.data('url_name', $(el.options[el.selectedIndex]).data('url_name'));
        }
        this.input(e);
        if (typeof this.options.onchange === 'function') {
          return this.options.onchange.call(this, e);
        }
      },
      on: function() {
        var event, handler, lastarg, proxy, target;
        event = arguments[0];
        lastarg = arguments[arguments.length - 1];
        target = typeof arguments[1] === 'string' ? arguments[1] : '.input';
        if (lastarg === true) {
          handler = arguments[arguments.length - 2];
          proxy = $.proxy(function(e) {
            if ($(e.target).is(target)) {
              return handler.apply(this, arguments);
            }
          }, this);
          this.element[0].addEventListener(event, proxy, true);
          return this.listeners.push([event, proxy, true]);
        } else {
          proxy = $.proxy(lastarg, this);
          this.element.on(event, target, proxy);
          return this.listeners.push([event, target, proxy]);
        }
      },
      bye: function() {
        return this.listeners.forEach((function(_this) {
          return function(l) {
            if (l[2] === true) {
              return _this.element[0].removeEventListener(l[0], l[1], true);
            } else {
              return _this.element.off(l[0], l[1], l[2]);
            }
          };
        })(this));
      },

      /**
      		 * return booleans for whether filtering is enabled on this target or not
      		 * @param  {$[0]} target element on which we need to know the filtering option
      		 * @return {boolean} whether we need filter the options from dropdown or not
       */
      mark_invalid_field: function(input) {
        var $el, $formElement, error;
        $el = input.target;
        $formElement = $el.closest('.form-element');
        $formElement.addClass('invalid focused');
        error = $el.data('error-text');
        if (error && error.length) {
          return $formElement.find('.helper-text').html(error);
        }
      },
      select_filterable: function(target) {
        if (target.tagName === 'SELECT') {
          return !$(target).attr('readOnly') && typeof (target.getAttribute('filter')) !== 'string';
        } else {
          return !target.readOnly && typeof (target.getAttribute('filter')) !== 'string';
        }
      },
      select_reveal: function(e) {
        var dropdown_ele, el, input, parent, rect;
        el = e.target;
        if (typeof el.select === 'function') {
          el.select();
        }
        parent = $(el.parentNode);
        if (!$(el).attr('non_selectable')) {
          parent.toggleClass('open');
        }
        input = parent.find('.input');
        if (typeof input.attr('multiselectwithall') === 'string') {
          dropdown_ele = parent.find(".select-outer");
          dropdown_ele.removeClass("select-outer-top");
          rect = dropdown_ele[0].getBoundingClientRect();
          if (rect.height + rect.top + 10 > window.innerHeight) {
            dropdown_ele.addClass("select-outer-top");
          }
        }
        if (this.select_filterable(el)) {
          this.select_filter(parent.find('.option'), el.value);
        }
        parent.find('.option.hover').removeClass('hover');
        return parent.find('.option:visible:eq(0)').addClass('hover');
      },
      select_key: function(e) {
        var hover, hover_index, index, options, parent;
        parent = $(e.target.parentNode);
        options = parent.find('.option');
        if (this.select_filterable(e.target)) {
          this.select_filter(options, e.target.value);
          options = options.filter(':visible');
        }
        if (!e.target.readOnly) {
          if (!parent.hasClass('open')) {
            parent.addClass('open');
          }
        }
        hover = options.filter('.hover');
        index = _.indexOf(options, hover[0]);
        if (parent.hasClass('open')) {
          if (e.which === 40) {
            if (index === options.length - 1) {
              hover_index = 0;
            } else {
              hover_index = index + 1;
            }
          } else if (e.which === 38) {
            hover_index = index - 1;
            if (hover_index < 0) {
              parent.removeClass('open');
              hover_index = 0;
            }
          } else if (e.which === 27) {
            parent.removeClass('open');
          } else if (e.which === 13 && hover.length) {
            this.select_option({
              currentTarget: hover.get(0)
            });
            parent.removeClass('open');
          }
        } else {
          if (e.which === 40) {
            return this.select_reveal(e);
          }
        }
        if (typeof hover_index === 'number') {
          this.select_hover({
            currentTarget: options.get(hover_index)
          });
        }
        return false;
      },
      select_filter: function(options, value) {
        var hovered, visible;
        options.each(function(index, option) {
          var text;
          text = option.textContent;
          index = text.toLowerCase().indexOf(value.toLowerCase());
          if (index === 0) {
            option.innerHTML = '<strong>' + text.slice(0, value.length) + '</strong>' + text.slice(value.length, text.length);
            return option.style.display = 'block';
          } else {
            return option.style.display = 'none';
          }
        });
        visible = options.filter(':visible');
        hovered = visible.filter('.hover');
        if (!hovered.length) {
          options.filter('.hover').removeClass('hover');
          hovered = visible.eq(0).addClass('hover');
        }
        if (hovered.length) {
          return this.select_scroll(hovered[0]);
        }
      },
      select_hover: function(e) {
        var hovered;
        if (this.js_scrolling && e.type === 'mouseover') {
          return;
        }
        hovered = $(e.currentTarget).addClass('hover');
        hovered.siblings('.hover').removeClass('hover');
        if (e.type === 'mouseover' || !hovered[0]) {
          return;
        }
        this.js_scrolling = true;
        this.select_scroll(hovered[0]);
        return setTimeout((function(_this) {
          return function() {
            return _this.js_scrolling = false;
          };
        })(this), 100);
      },
      select_scroll: function(client) {
        var clientrect, parent, parentrect;
        parent = client.parentNode;
        clientrect = client.getBoundingClientRect();
        parentrect = parent.getBoundingClientRect();
        if (parentrect.bottom < clientrect.bottom) {
          return parent.scrollTop += clientrect.bottom - parentrect.bottom;
        } else if (parentrect.top > clientrect.top) {
          return parent.scrollTop -= parentrect.top - clientrect.top;
        }
      },
      select_in_multiselectwithall: function(ele_select) {
        var $el, array_data, container, i, input, item, len, new_value, ref, selected, value;
        $el = $(ele_select);
        container = $el.closest('.form-element');
        if (!container.hasClass('filled')) {
          container.addClass('filled');
        }
        input = container.find('.input');
        if (typeof input.attr('multiselectwithall') === 'string') {
          $el.toggleClass('selected');
          value = $el.prop('textContent');
          if (this.options.select_key) {
            selected = $el.hasClass('selected');
            if ($el.hasClass('all-option')) {
              if (selected) {
                $el.siblings('.item-option').addClass('selected');
              } else {
                $el.siblings('.item-option').removeClass('selected');
              }
            } else {
              if (selected && container.find('.item-option').length === container.find('.item-option.selected').length) {
                container.find(".all-option").addClass('selected');
              } else {
                container.find(".all-option").removeClass('selected');
              }
            }
            new_value = "";
            array_data = [];
            if (container.find('.all-option.selected').length > 0) {
              new_value = container.find('.all-option.selected').text().trim();
            } else if (container.find('.item-option.selected').length > 0) {
              ref = container.find('.item-option.selected');
              for (i = 0, len = ref.length; i < len; i++) {
                item = ref[i];
                array_data.push(item.textContent.trim());
              }
              new_value = array_data.join().trim();
            }
            input.val(new_value).trigger('change', $el.attr('value'));
            return this.input({
              target: input[0]
            });
          }
        }
      },
      select_option: function(e) {
        var $el, container, input, input_class, value;
        $el = $(e.currentTarget);
        container = $el.closest('.form-element');
        if ($el.data('class')) {
          input_class = '.' + $el.data('class').trim().split(' ').join('.');
          input = container.find(input_class);
        } else {
          input = container.find('.input');
        }
        if (typeof input.attr('multiselectwithall') === 'string') {
          this.select_in_multiselectwithall($el);
          return container.addClass('open');
        } else {
          $el.addClass('selected').siblings('.selected').removeClass('selected');
          if ($el.attr('value') && $el.data('class') === 'input country-code') {
            value = $el.attr('value');
            input.data('url_name', $el.data('url_name'));
          } else {
            value = $el.prop('textContent');
          }
          if (this.options.select_key) {
            input.val(value).trigger('change', $el.attr('value'));
            input.attr('data-length', value.length);
            this.input({
              target: input[0]
            });
          }
          if (typeof input.attr('multiselect') === 'string') {
            return container.addClass('open');
          }
        }
      },
      select_down: function(e) {
        var select;
        this.selectdown = true;
        select = $(e.currentTarget);
        return $(window).one('mouseup', (function(_this) {
          return function(e) {
            var input, targetclass;
            _this.selectdown = false;
            targetclass = e.target.className;
            input = select.closest('.form-element').children('.input')[0];
            if (!input) {
              return;
            }
            if (select[0] === e.target) {
              return input.focus();
            } else {
              return _this.blur({
                target: input
              });
            }
          };
        })(this));
      },
      numeric_plus: function(e) {
        return this.numeric_update(e, 1);
      },
      numeric_minus: function(e) {
        return this.numeric_update(e, -1);
      },
      numeric_update: function(e, delta) {
        var $input, $target, val;
        $target = $(e.target);
        $input = $target.siblings('.input.numeric');
        val = (parseInt($input.val())) || 0;
        val = val + delta;
        if (val < 0) {
          val = 0;
        }
        $input.val(val).trigger('input');
        if (typeof this.options.onchange === 'function') {
          return this.options.onchange.call(this, {
            target: $input
          });
        }
      },
      refresh: function() {
        this.other_events();
        return this.element.find('.form-element').each((function(_this) {
          return function(index, parent) {
            return _this.update_childs(parent);
          };
        })(this));
      },
      initiate: function(parent, el, type) {
        var name;
        parent.data('smarty', true);
        if (this.options.tooltips) {
          parent.append('<div class="input-helper"><div class="up-arrow"></div><div class="helper-text">' + this.helptext(el) + '</div></div>');
        }
        if (document.activeElement === el) {
          parent.addClass('focused');
        }
        if (/checkbox|radio/.test(type)) {
          parent.addClass('filled');
        }
        if (el.getAttribute('pattern') && !el.pattern) {
          el.pattern = el.getAttribute('pattern');
        }
        name = el.getAttribute('name');
        if (name) {
          name = name.toLowerCase().replace(/[^a-z].*/, '');
          if (!el.pattern && this.validations[name]) {
            return el.pattern = this.validations[name];
          }
        }
      },

      /**
      		 * updates all inputs the childs in a form element
      		 * @param  {$[0]} parent the form element
       */
      update_childs: function(parent) {
        var els;
        els = parent.querySelectorAll('.input');
        return _.each(els, (function(_this) {
          return function(el) {
            return _this.update(parent, el);
          };
        })(this));
      },
      update: function(parent, el) {
        var $parent, addClass, removeClass, type;
        type = el.getAttribute('type');
        $parent = $(parent);
        if ($(el).hasClass('tt-hint')) {
          el = $(el).next('input')[0];
        }
        removeClass = 'filled invalid';
        if (this.options.mature && this.options.refreshMaturity) {
          removeClass += ' mature';
        }
        $parent.removeClass(removeClass);
        if (!$parent.data('smarty')) {
          this.initiate($parent, el, type);
        }
        if (!(/checkbox|radio/.test(type))) {
          if (el.value) {
            addClass = 'filled';
            if (this.options.mature) {
              addClass += ' mature';
            }
            $parent.addClass(addClass);
          } else if (el.getAttribute('placeholder') && this.options.ignorePlaceholder !== true) {
            $parent.addClass('filled');
          }
        }
        if (typeof $(el).attr('multiselectwithall') === 'string') {
          $parent.find(".all-option").removeClass("selected");
          this.select_in_multiselectwithall($parent.find(".all-option"));
        }

        /**
        			 * if the input is of type tel and has the country-code attribute the we will append the country code
        			 * dropdown to it
         */
        if (type === 'tel' && $(el).attr('country-code') && !($parent.find('.country-code').length)) {
          if (Housing.country_codes) {
            this.populate_country_code($parent);
          } else {
            if (!this.ajax) {
              this.ajax = Housing.ajax({
                url: Housing.leadServiceBaseUrl + '/api/v0/countries/crf',
                success: (function(_this) {
                  return function(data) {
                    _this.process_country_code_data(data);
                    return _this.populate_country_code($parent);
                  };
                })(this),
                error: (function(_this) {
                  return function() {
                    return hlog('error');
                  };
                })(this)
              });
            }
          }
        }
        return this.input({
          target: el
        });
      },

      /**
      		 * Once we have country_codes this function add the
      		 * @param  {$ selector} $parent the type=tel input in which the country code needs to be put.
       */
      populate_country_code: function($parent) {
        var country_input, self, tag_name;
        if (!Housing.country_codes) {
          return;
        }
        if (Housing.Util.is_touch()) {
          tag_name = 'select';
        } else {
          tag_name = 'input';
        }
        country_input = '<' + tag_name + ' class="input country-code" id="inputCountryCode" value="+91" name="country_code" type="select" required readOnly data-text=true data-length="3" data-url_name="in">';
        $parent.find('.input[country-code]').before(country_input);
        $parent.addClass('with-country-code');
        self = this;
        return require(['backbone/helpers/dull_dropdown'], (function(_this) {
          return function(dull) {
            var target;
            target = $parent.find('.country-code');
            target.data('dull-index', self.dull_dropdowns.length);
            self.dull_dropdowns.push(new dull(target, Housing.country_codes));
            if (_this.element) {
              Housing.Util.prefillForm(_this.element);
            }
            return self.refresh();
          };
        })(this));
      },

      /**
      		 * Process the date to show, populates Housing.country_codes
      		 * @param  {Array of Objects} data
      		 * @return {Array of Objects} Housing.country_codes
       */
      process_country_code_data: function(data) {
        var cc_arr, make;
        if (Housing.country_codes) {
          return;
        }
        cc_arr = [];
        make = function(cc) {
          cc.country_name = cc.name;
          cc.country_url_name = cc.url_name;
          if (Housing.Util.is_touch()) {
            cc.name = cc.country_code + ' - ' + cc.name;
          } else {
            cc.name = '<span class="cc-opt">' + cc.country_code + '</span>' + cc.name;
          }
          cc.value = cc.country_code;
          cc.id = cc.value;
          return cc_arr.push(cc);
        };
        if (!Housing.Util.is_touch()) {
          cc_arr.push({
            category: 'label',
            label: 'Top Countries'
          });
        }
        data.top_countries.forEach(make);
        if (!Housing.Util.is_touch()) {
          cc_arr.push({
            category: 'label',
            label: 'All Countries'
          });
        }
        data.all_countries.forEach(make);
        return Housing.country_codes = cc_arr;
      },
      get_parent: function(parent) {
        if (!parent.hasClass('form-element')) {
          parent = parent.parent('.form-element');
        }
        return parent;
      }
    };
  });

}).call(this);

/**
 * @package		PickMeUp - jQuery datepicker plugin
 * @author		Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @author		Stefan Petre <www.eyecon.ro>
 * @copyright	Copyright (c) 2013-2015, Nazar Mokrynskyi
 * @copyright	Copyright (c) 2008-2009, Stefan Petre
 * @license		MIT License, see license.txt
 */

(function (d) {
	function getMaxDays () {
		var tmpDate	= new Date(this.toString()),
			d		= 28,
			m		= tmpDate.getMonth();
		while (tmpDate.getMonth() == m) {
			++d;
			tmpDate.setDate(d);
		}
		return d - 1;
	}
	d.addDays		= function (n) {
		this.setDate(this.getDate() + n);
	};
	d.addMonths	= function (n) {
		var day	= this.getDate();
		this.setDate(1);
		this.setMonth(this.getMonth() + n);
		this.setDate(Math.min(day, getMaxDays.apply(this)));
	};
	d.addYears		= function (n) {
		var day	= this.getDate();
		this.setDate(1);
		this.setFullYear(this.getFullYear() + n);
		this.setDate(Math.min(day, getMaxDays.apply(this)));
	};
	d.getDayOfYear	= function() {
		var now		= new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
		var then	= new Date(this.getFullYear(), 0, 0, 0, 0, 0);
		var time	= now - then;
		return Math.floor(time / 24*60*60*1000);
	};
})(Date.prototype);

(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define('backbone/helpers/jquery.pickmeup',['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	var instances_count	= 0;
	$.pickmeup = $.extend($.pickmeup || {}, {
		date			: new Date,
		default_date	: new Date,
		flat			: false,
		first_day		: 1,
		prev			: '&#9664;',
		next			: '&#9654;',
		mode			: 'single',
		select_year		: true,
		select_month	: true,
		select_day		: true,
		view			: 'days',
		calendars		: 1,
		format			: 'd-m-Y',
		position		: 'bottom',
		trigger_event	: 'click touchstart',
		class_name		: '',
		separator		: ' - ',
		hide_on_select	: false,
		min				: null,
		max				: null,
		render			: function () {},
		change			: function () {return true;},
		before_show		: function () {return true;},
		show			: function () {return true;},
		hide			: function () {return true;},
		fill			: function () {return true;},
		locale			: {
			days		: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
			daysShort	: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			daysMin		: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
			months		: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			monthsShort	: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		}
	});
	var	views	= {
			years	: 'pmu-view-years',
			months	: 'pmu-view-months',
			days	: 'pmu-view-days'
		},
		tpl		= {
			wrapper	: '<div class="pickmeup" />',
			head	: function (d) {
				var result	= '';
				for (var i = 0; i < 7; ++i) {
					result	+= '<div>' + d.day[i] + '</div>'
				}
				return '<div class="pmu-instance">' +
					'<nav>' +
						'<div class="pmu-prev pmu-button">' + d.prev + '</div>' +
						'<div class="pmu-month pmu-button" />' +
						'<div class="pmu-next pmu-button">' + d.next + '</div>' +
					'</nav>' +
					'<nav class="pmu-day-of-week">' + result + '</nav>' +
				'</div>';
			},
			body	: function (elements, container_class_name) {
				var result	= '';
				for (var i = 0; i < elements.length; ++i) {
					result	+= '<div class="' + elements[i].class_name + ' pmu-button">' + elements[i].text + '</div>'
				}
				return '<div class="' + container_class_name + '">' + result + '</div>';
			}
		};
	function fill () {
		var options			= $(this).data('pickmeup-options'),
			pickmeup		= this.pickmeup,
			current_cal		= Math.floor(options.calendars / 2),
			actual_date		= options.date,
			current_date	= options.current,
			min_date		= options.min ? new Date(options.min) : null,
			max_date		= options.max ? new Date(options.max) : null,
			local_date,
			header,
			html,
			instance,
			today		= (new Date).setHours(0,0,0,0).valueOf(),
			shown_date_from,
			shown_date_to,
			tmp_date;
		if (min_date) {
			min_date.setDate(1);
			min_date.addMonths(1);
			min_date.addDays(-1);
		}
		if (max_date) {
			max_date.setDate(1);
			max_date.addMonths(1);
			max_date.addDays(-1);
		}
		/**
		 * Remove old content except header navigation
		 */
		pickmeup.find('.pmu-instance > :not(nav)').remove();
		/**
		 * If several calendars should be shown
		 */
		for (var i = 0; i < options.calendars; i++) {
			local_date		= new Date(current_date);
			instance	= pickmeup.find('.pmu-instance').eq(i);
			if (pickmeup.hasClass('pmu-view-years')) {
				local_date.addYears((i - current_cal) * 12);
				header = (local_date.getFullYear() - 6) + ' - ' + (local_date.getFullYear()+5);
			} else if (pickmeup.hasClass('pmu-view-months')) {
				local_date.addYears(i - current_cal);
				header = local_date.getFullYear();
			} else if (pickmeup.hasClass('pmu-view-days')) {
				local_date.addMonths(i - current_cal);
				header = formatDate(local_date, 'B, Y', options.locale);
			}
			if (!shown_date_to) {
				if (max_date) {
					// If all dates in this month (months in year or years in years block) are after max option - set next month as current
					// in order not to show calendar with all disabled dates
					tmp_date	= new Date(local_date);
					if (options.select_day) {
						tmp_date.addMonths(options.calendars - 1);
					} else if (options.select_month) {
						tmp_date.addYears(options.calendars - 1);
					} else {
						tmp_date.addYears((options.calendars - 1) * 12);
					}
					if (tmp_date > max_date) {
						--i;
						current_date.addMonths(-1);
						shown_date_to	= undefined;
						continue;
					}
				}
			}
			shown_date_to	= new Date(local_date);
			if (!shown_date_from) {
				shown_date_from = new Date(local_date);
				// If all dates in this month are before min option - set next month as current in order not to show calendar with all disabled dates
				shown_date_from.setDate(1);
				shown_date_from.addMonths(1);
				shown_date_from.addDays(-1);
				if (min_date && min_date > shown_date_from) {
					--i;
					current_date.addMonths(1);
					shown_date_from	= undefined;
					continue;
				}
			}
			instance
				.find('.pmu-month')
				.text(header);
			html			= '';
			var is_year_selected	= function (year) {
				return	(
							options.mode == 'range' &&
							year >= new Date(actual_date[0]).getFullYear() &&
							year <= new Date(actual_date[1]).getFullYear()
						) ||
						(
							options.mode == 'multiple' &&
							actual_date.reduce(function (prev, current) {
								prev.push(new Date(current).getFullYear());
								return prev;
							}, []).indexOf(year) !== -1
						) ||
						new Date(actual_date).getFullYear() == year;
			};
			var is_months_selected	= function (year, month) {
				var first_year	= new Date(actual_date[0]).getFullYear(),
					lastyear	= new Date(actual_date[1]).getFullYear(),
					first_month	= new Date(actual_date[0]).getMonth(),
					last_month	= new Date(actual_date[1]).getMonth();
				return	(
							options.mode == 'range' &&
							year > first_year &&
							year < lastyear
						) ||
						(
							options.mode == 'range' &&
							year == first_year &&
							year < lastyear &&
							month >= first_month
						) ||
						(
							options.mode == 'range' &&
							year > first_year &&
							year == lastyear &&
							month <= last_month
						) ||
						(
							options.mode == 'range' &&
							year == first_year &&
							year == lastyear &&
							month >= first_month &&
							month <= last_month
						) ||
						(
							options.mode == 'multiple' &&
							actual_date.reduce(function (prev, current) {
								current	= new Date(current);
								prev.push(current.getFullYear() + '-' + current.getMonth());
								return prev;
							}, []).indexOf(year + '-' + month) !== -1
						) ||
						(
							new Date(actual_date).getFullYear() == year &&
							new Date(actual_date).getMonth() == month
						)
			};
			(function () {
				var years			= [],
					start_from_year	= local_date.getFullYear() - 6,
					min_year		= new Date(options.min).getFullYear(),
					max_year		= new Date(options.max).getFullYear(),
					year;
				for (var j = 0; j < 12; ++j) {
					year	= {
						text		: start_from_year + j,
						class_name	: []
					};
					if (
						(
							options.min && year.text < min_year
						) ||
						(
							options.max && year.text > max_year
						)
					) {
						year.class_name.push('pmu-disabled');
					} else if (is_year_selected(year.text)) {
						year.class_name.push('pmu-selected');
					}
					year.class_name	= year.class_name.join(' ');
					years.push(year);
				}
				html	+= tpl.body(years, 'pmu-years');
			})();
			(function () {
				var months			= [],
					current_year	= local_date.getFullYear(),
					min_year		= new Date(options.min).getFullYear(),
					min_month		= new Date(options.min).getMonth(),
					max_year		= new Date(options.max).getFullYear(),
					max_month		= new Date(options.max).getMonth(),
					month;
				for (var j = 0; j < 12; ++j) {
					month	= {
						text		: options.locale.monthsShort[j],
						class_name	: []
					};
					if (
						(
							options.min &&
							(
								current_year < min_year ||
								(
									j < min_month && current_year == min_year
								)
							)
						) ||
						(
							options.max &&
							(
								current_year > max_year ||
								(
									j > max_month && current_year >= max_year
								)
							)
						)
					) {
						month.class_name.push('pmu-disabled');
					} else if (is_months_selected(current_year, j)) {
						month.class_name.push('pmu-selected');
					}
					month.class_name	= month.class_name.join(' ');
					months.push(month);
				}
				html	+= tpl.body(months, 'pmu-months');
			})();
			(function () {
				var days			= [],
					current_month	= local_date.getMonth(),
					day;
				// Correct first day in calendar taking into account first day of week (Sunday or Monday)
				(function () {
					local_date.setDate(1);
					var day = (local_date.getDay() - options.first_day) % 7;
					local_date.addDays(-(day + (day < 0 ? 7 : 0)));
				})();
				for (var j = 0; j < 42; ++j) {
					day	= {
						text		: local_date.getDate(),
						class_name	: []
					};
					if (current_month != local_date.getMonth()) {
						day.class_name.push('pmu-not-in-month');
					}
					if (local_date.getDay() == 0) {
						day.class_name.push('pmu-sunday');
					} else if (local_date.getDay() == 6) {
						day.class_name.push('pmu-saturday');
					}
					var from_user	= options.render(new Date(local_date)) || {},
						val			= local_date.valueOf(),
						disabled	= (options.min && options.min > local_date) || (options.max && options.max < local_date);
					if (from_user.disabled || disabled) {
						day.class_name.push('pmu-disabled');
					} else if (
						from_user.selected ||
						options.date == val ||
						$.inArray(val, options.date) !== -1 ||
						(
							options.mode == 'range' && val >= options.date[0] && val <= options.date[1]
						)
					) {
						day.class_name.push('pmu-selected');
					}
					if (val == today) {
						day.class_name.push('pmu-today');
					}
					if (from_user.class_name) {
						day.class_name.push(from_user.class_name);
					}
					day.class_name = day.class_name.join(' ');
					days.push(day);
					// Move to next day
					local_date.addDays(1);
				}
				html	+= tpl.body(days, 'pmu-days');
			})();
			instance.append(html);
		}
		shown_date_from.setDate(1);
		shown_date_to.setDate(1);
		shown_date_to.addMonths(1);
		shown_date_to.addDays(-1);
		pickmeup.find('.pmu-prev').css(
			'visibility',
			options.min && options.min >= shown_date_from ? 'hidden' : 'visible'
		);
		pickmeup.find('.pmu-next').css(
			'visibility',
			options.max && options.max <= shown_date_to ? 'hidden' : 'visible'
		);
		options.fill.apply(this);
	}
	function parseDate (date, format, separator, locale) {
		if (date.constructor == Date) {
			return date;
		} else if (!date) {
			return new Date;
		}
		var splitted_date	= date.split(separator);
		if (splitted_date.length > 1) {
			splitted_date.forEach(function (element, index, array) {
				array[index]	= parseDate($.trim(element), format, separator, locale);
			});
			return splitted_date;
		}
		var months_text	= locale.monthsShort.join(')(') + ')(' + locale.months.join(')('),
			separator	= new RegExp('[^0-9a-zA-Z(' + months_text + ')]+'),
			parts		= date.split(separator),
			against		= format.split(separator),
			d,
			m,
			y,
			h,
			min,
			now = new Date();
		for (var i = 0; i < parts.length; i++) {
			switch (against[i]) {
				case 'b':
					m = locale.monthsShort.indexOf(parts[i]);
				break;
				case 'B':
					m = locale.months.indexOf(parts[i]);
				break;
				case 'd':
				case 'e':
					d = parseInt(parts[i],10);
				break;
				case 'm':
					m = parseInt(parts[i], 10)-1;
				break;
				case 'Y':
				case 'y':
					y = parseInt(parts[i], 10);
					y += y > 100 ? 0 : (y < 29 ? 2000 : 1900);
				break;
				case 'H':
				case 'I':
				case 'k':
				case 'l':
					h = parseInt(parts[i], 10);
				break;
				case 'P':
				case 'p':
					if (/pm/i.test(parts[i]) && h < 12) {
						h += 12;
					} else if (/am/i.test(parts[i]) && h >= 12) {
						h -= 12;
					}
				break;
				case 'M':
					min = parseInt(parts[i], 10);
				break;
			}
		}
		var parsed_date = new Date(
			y === undefined ? now.getFullYear() : y,
			m === undefined ? now.getMonth() : m,
			d === undefined ? now.getDate() : d,
			h === undefined ? now.getHours() : h,
			min === undefined ? now.getMinutes() : min,
			0
		);
		if (isNaN(parsed_date * 1)) {
			parsed_date = new Date;
		}
		return parsed_date;
	}
	function formatDate (date, format, locale) {
		var m = date.getMonth();
		var d = date.getDate();
		var y = date.getFullYear();
		var w = date.getDay();
		var s = {};
		var hr = date.getHours();
		var pm = (hr >= 12);
		var ir = (pm) ? (hr - 12) : hr;
		var dy = date.getDayOfYear();
		if (ir == 0) {
			ir = 12;
		}
		var min = date.getMinutes();
		var sec = date.getSeconds();
		var parts = format.split(''), part;
		for (var i = 0; i < parts.length; i++) {
			part = parts[i];
			switch (part) {
				case 'a':
					part = locale.daysShort[w];
				break;
				case 'A':
					part = locale.days[w];
				break;
				case 'b':
					part = locale.monthsShort[m];
				break;
				case 'B':
					part = locale.months[m];
				break;
				case 'C':
					part = 1 + Math.floor(y / 100);
				break;
				case 'd':
					part = (d < 10) ? ("0" + d) : d;
				break;
				case 'e':
					part = d;
				break;
				case 'H':
					part = (hr < 10) ? ("0" + hr) : hr;
				break;
				case 'I':
					part = (ir < 10) ? ("0" + ir) : ir;
				break;
				case 'j':
					part = (dy < 100) ? ((dy < 10) ? ("00" + dy) : ("0" + dy)) : dy;
				break;
				case 'k':
					part = hr;
				break;
				case 'l':
					part = ir;
				break;
				case 'm':
					part = (m < 9) ? ("0" + (1+m)) : (1+m);
				break;
				case 'M':
					part = (min < 10) ? ("0" + min) : min;
				break;
				case 'p':
				case 'P':
					part = pm ? "PM" : "AM";
				break;
				case 's':
					part = Math.floor(date.getTime() / 1000);
				break;
				case 'S':
					part = (sec < 10) ? ("0" + sec) : sec;
				break;
				case 'u':
					part = w + 1;
				break;
				case 'w':
					part = w;
				break;
				case 'y':
					part = ('' + y).substr(2, 2);
				break;
				case 'Y':
					part = y;
				break;
			}
			parts[i] = part;
		}
		return parts.join('');
	}
	function update_date () {
		var	$this			= $(this),
			options			= $this.data('pickmeup-options'),
			current_date	= options.current,
			new_value;
		switch (options.mode) {
			case 'multiple':
				new_value = current_date.setHours(0,0,0,0).valueOf();
				if ($.inArray(new_value, options.date) !== -1) {
					$.each(options.date, function (index, value){
						if (value == new_value) {
							options.date.splice(index,1);
							return false;
						}
						return true;
					});
				} else {
					options.date.push(new_value);
				}
				break;
			case 'range':
				if (!options.lastSel) {
					options.date[0]	= current_date.setHours(0,0,0,0).valueOf();
				}
				new_value	= current_date.setHours(0,0,0,0).valueOf();
				if (new_value <= options.date[0]) {
					options.date[1]	= options.date[0];
					options.date[0]	= new_value;
				} else {
					options.date[1]	= new_value;
				}
				options.lastSel	= !options.lastSel;
				break;
			default:
				options.date	= current_date.valueOf();
				break;
		}
		var prepared_date	= prepareDate(options);
		if ($this.is('input')) {
			$this.val(options.mode == 'single' ? prepared_date[0] : prepared_date[0].join(options.separator));
		}
		options.change.apply(this, prepared_date);
		if (
			!options.flat &&
			options.hide_on_select &&
			(
				options.mode != 'range' ||
				!options.lastSel
			)
		) {
			options.binded.hide();
			return false;
		}
	}
	function click (e) {
		var el	= $(e.target);
		if (!el.hasClass('pmu-button')) {
			el	= el.closest('.pmu-button');
		}
		if (el.length) {
			if (el.hasClass('pmu-disabled')) {
				return false;
			}
			var	$this			= $(this),
				options			= $this.data('pickmeup-options'),
				instance		= el.parents('.pmu-instance').eq(0),
				root			= instance.parent(),
				instance_index	= $('.pmu-instance', root).index(instance);
			if (el.parent().is('nav')) {
				if (el.hasClass('pmu-month')) {
					options.current.addMonths(instance_index - Math.floor(options.calendars / 2));
					if (root.hasClass('pmu-view-years')) {
						// Shift back to current date, otherwise with min value specified may jump on few (tens) years forward
						if (options.mode != 'single') {
							options.current	= new Date(options.date[options.date.length - 1]);
						} else {
							options.current	= new Date(options.date);
						}
						if (options.select_day) {
							root.removeClass('pmu-view-years').addClass('pmu-view-days');
						} else if (options.select_month) {
							root.removeClass('pmu-view-years').addClass('pmu-view-months');
						}
					} else if (root.hasClass('pmu-view-months')) {
						if (options.select_year) {
							root.removeClass('pmu-view-months').addClass('pmu-view-years');
						} else if (options.select_day) {
							root.removeClass('pmu-view-months').addClass('pmu-view-days');
						}
					} else if (root.hasClass('pmu-view-days')) {
						if (options.select_month) {
							root.removeClass('pmu-view-days').addClass('pmu-view-months');
						} else if (options.select_year) {
							root.removeClass('pmu-view-days').addClass('pmu-view-years');
						}
					}
				} else {
					if (el.hasClass('pmu-prev')) {
						options.binded.prev(false);
					} else {
						options.binded.next(false);
					}
				}
			} else if (!el.hasClass('pmu-disabled')) {
				if (root.hasClass('pmu-view-years')) {
					options.current.setFullYear(parseInt(el.text(), 10));
					if (options.select_month) {
						root.removeClass('pmu-view-years').addClass('pmu-view-months');
					} else if (options.select_day) {
						root.removeClass('pmu-view-years').addClass('pmu-view-days');
					} else {
						options.binded.update_date();
					}
				} else if (root.hasClass('pmu-view-months')) {
					options.current.setMonth(instance.find('.pmu-months .pmu-button').index(el));
					options.current.setFullYear(parseInt(instance.find('.pmu-month').text(), 10));
					if (options.select_day) {
						root.removeClass('pmu-view-months').addClass('pmu-view-days');
					} else {
						options.binded.update_date();
					}
					// Move current month to the first place
					options.current.addMonths(Math.floor(options.calendars / 2) - instance_index);
				} else {
					var val	= parseInt(el.text(), 10);
					options.current.addMonths(instance_index - Math.floor(options.calendars / 2));
					if (el.hasClass('pmu-not-in-month')) {
						options.current.addMonths(val > 15 ? -1 : 1);
					}
					options.current.setDate(val);
					options.binded.update_date();
				}
			}
			options.binded.fill();
		}
		return false;
	}
	function prepareDate (options) {
		var result;
		if (options.mode == 'single') {
			result = new Date(options.date);
			return [formatDate(result, options.format, options.locale), result];
		} else {
			result = [[],[]];
			$.each(options.date, function(nr, val){
				var date = new Date(val);
				result[0].push(formatDate(date, options.format, options.locale));
				result[1].push(date);
			});
			return result;
		}
	}
	function show (force) {
		var pickmeup	= this.pickmeup;
		if (force || !pickmeup.is(':visible')) {
			var $this		= $(this),
				options		= $this.data('pickmeup-options'),
				pos			= $this.offset(),
				viewport	= {
					l : document.documentElement.scrollLeft,
					t : document.documentElement.scrollTop,
					w : document.documentElement.clientWidth,
					h : document.documentElement.clientHeight
				},
				top			= pos.top,
				left		= pos.left;
			options.binded.fill();
			if ($this.is('input')) {
				$this
					.pickmeup('set_date', parseDate($this.val() ? $this.val() : options.default_date, options.format, options.separator, options.locale))
					.keydown(function (e) {
						if (e.which == 9) {
							$this.pickmeup('hide');
						}
					});
				options.lastSel = false;
			}
			options.before_show();
			if (options.show() == false) {
				return;
			}
			if (!options.flat) {
				switch (options.position){
					case 'top':
						top -= pickmeup.outerHeight();
						break;
					case 'left':
						left -= pickmeup.outerWidth();
						break;
					case 'right':
						left += this.offsetWidth;
						break;
					case 'bottom':
						top += this.offsetHeight;
						break;
				}
				if (top + pickmeup.offsetHeight > viewport.t + viewport.h) {
					top = pos.top  - pickmeup.offsetHeight;
				}
				if (top < viewport.t) {
					top = pos.top + this.offsetHeight + pickmeup.offsetHeight;
				}
				if (left + pickmeup.offsetWidth > viewport.l + viewport.w) {
					left = pos.left - pickmeup.offsetWidth;
				}
				if (left < viewport.l) {
					left = pos.left + this.offsetWidth
				}
				pickmeup.css({
					display	: 'inline-block',
					top		: top + 'px',
					left	: left + 'px'
				});
				$(document)
					.on(
						'mousedown' + options.events_namespace + ' touchstart' + options.events_namespace,
						options.binded.hide
					)
					.on(
						'resize' + options.events_namespace,
						[
							true
						],
						options.binded.forced_show
					);
			}
		}
	}
	function forced_show () {
		show.call(this, true);
	}
	function hide (e) {
		if (
			!e ||
			!e.target ||														//Called directly
			(
				e.target != this &&												//Clicked not on element itself
				!(this.pickmeup.get(0).compareDocumentPosition(e.target) & 16)	//And not o its children
			)
		) {
			var pickmeup	= this.pickmeup,
				options		= $(this).data('pickmeup-options');
			if (options.hide() != false) {
				pickmeup.hide();
				$(document)
					.off('mousedown touchstart', options.binded.hide)
					.off('resize', options.binded.forced_show);
				options.lastSel	= false;
			}
		}
	}
	function update () {
		var	options	= $(this).data('pickmeup-options');
		$(document)
			.off('mousedown', options.binded.hide)
			.off('resize', options.binded.forced_show);
		options.binded.forced_show();
	}
	function clear () {
		var options = $(this).data('pickmeup-options');
		if (options.mode != 'single') {
			options.date	= [];
			options.lastSel	= false;
			options.binded.fill();
		}
	}
	function prev (fill) {
		if (typeof fill == 'undefined') {
			fill = true;
		}
		var root	= this.pickmeup;
		var options	= $(this).data('pickmeup-options');
		if (root.hasClass('pmu-view-years')) {
			options.current.addYears(-12);
		} else if (root.hasClass('pmu-view-months')) {
			options.current.addYears(-1);
		} else if (root.hasClass('pmu-view-days')) {
			options.current.addMonths(-1);
		}
		if (fill) {
			options.binded.fill();
		}
	}
	function next (fill) {
		if (typeof fill == 'undefined') {
			fill = true;
		}
		var root	= this.pickmeup;
		var options	= $(this).data('pickmeup-options');
		if (root.hasClass('pmu-view-years')) {
			options.current.addYears(12);
		} else if (root.hasClass('pmu-view-months')) {
			options.current.addYears(1);
		} else if (root.hasClass('pmu-view-days')) {
			options.current.addMonths(1);
		}
		if (fill) {
			options.binded.fill();
		}
	}
	function get_date (formatted) {
		var options			= $(this).data('pickmeup-options'),
			prepared_date	= prepareDate(options);
		if (typeof formatted === 'string') {
			var date = prepared_date[1];
			if (date.constructor == Date) {
				return formatDate(date, formatted, options.locale)
			} else {
				return date.map(function (value) {
					return formatDate(value, formatted, options.locale);
				});
			}
		} else {
			return prepared_date[formatted ? 0 : 1];
		}
	}
	function set_date (date) {
		var $this	= $(this),
			options = $this.data('pickmeup-options');
		options.date = date;
		if (typeof options.date === 'string') {
			options.date = parseDate(options.date, options.format, options.separator, options.locale).setHours(0,0,0,0);
		} else if (options.date.constructor == Date) {
			options.date.setHours(0,0,0,0);
		}
		if (!options.date) {
			options.date = new Date;
			options.date.setHours(0,0,0,0);
		}
		if (options.mode != 'single') {
			if (options.date.constructor != Array) {
				options.date = [options.date.valueOf()];
				if (options.mode == 'range') {
					options.date.push(((new Date(options.date[0])).setHours(0,0,0,0)).valueOf());
				}
			} else {
				for (var i = 0; i < options.date.length; i++) {
					options.date[i] = (parseDate(options.date[i], options.format, options.separator, options.locale).setHours(0,0,0,0)).valueOf();
				}
				if (options.mode == 'range') {
					options.date[1] = ((new Date(options.date[1])).setHours(0,0,0,0)).valueOf();
				}
			}
		} else {
			if($this.val() || options.default_date !== false) {
				options.date = options.date.constructor == Array ? options.date[0].valueOf() : options.date.valueOf();
			}
		}
		options.current = new Date (options.mode != 'single' ? options.date[0] : options.date);
		options.binded.fill();
		if ($this.is('input')) {
			var prepared_date	= prepareDate(options);
			$this.val(
				options.mode == 'single'
					? (options.default_date === false ? $this.val() : prepared_date[0])
					: prepared_date[0].join(options.separator)
			);
		}
	}
	function destroy () {
		var	$this	= $(this),
			options	= $this.data('pickmeup-options');
		$this.removeData('pickmeup-options');
		$this.off(options.events_namespace);
		$(document).off(options.events_namespace);
		$(this.pickmeup).remove();
	}
	$.fn.pickmeup	= function (initial_options) {
		if (typeof initial_options === 'string') {
			var data,
				parameters	= Array.prototype.slice.call(arguments, 1);
			switch (initial_options) {
				case 'hide':
				case 'show':
				case 'clear':
				case 'update':
				case 'prev':
				case 'next':
				case 'destroy':
					this.each(function () {
						data	= $(this).data('pickmeup-options');
						if (data) {
							data.binded[initial_options]();
						}
					});
				break;
				case 'get_date':
					data	= this.data('pickmeup-options');
					if (data) {
						return data.binded.get_date(parameters[0]);
					} else {
						return null;
					}
				break;
				case 'set_date':
					this.each(function () {
						data	= $(this).data('pickmeup-options');
						if (data) {
							data.binded[initial_options].apply(this, parameters);
						}
					});
			}
			return this;
		}
		return this.each(function () {
			var	$this			= $(this);
			if ($this.data('pickmeup-options')) {
				return;
			}
			if (initial_options && initial_options.locale) {
				initial_options.locale = $.extend({}, $.pickmeup.locale, initial_options.locale);
			}
			var i,
				option,
				options	= $.extend({}, $.pickmeup, initial_options || {});
			for (i in options) {
				option	= $this.data('pmu-' + i);
				if (typeof option !== 'undefined') {
					options[i]	= option;
				}
			}
			// 4 conditional statements in order to account all cases
			if (options.view == 'days' && !options.select_day) {
				options.view	= 'months';
			}
			if (options.view == 'months' && !options.select_month) {
				options.view	= 'years';
			}
			if (options.view == 'years' && !options.select_year) {
				options.view	= 'days';
			}
			if (options.view == 'days' && !options.select_day) {
				options.view	= 'months';
			}
			options.calendars	= Math.max(1, parseInt(options.calendars, 10) || 1);
			options.mode		= /single|multiple|range/.test(options.mode) ? options.mode : 'single';
			if (typeof options.min === 'string') {
				options.min = parseDate(options.min, options.format, options.separator, options.locale).setHours(0,0,0,0);
			} else if (options.min && options.min.constructor == Date) {
				options.min.setHours(0,0,0,0);
			}
			if (typeof options.max === 'string') {
				options.max = parseDate(options.max, options.format, options.separator, options.locale).setHours(0,0,0,0);
			} else if (options.max && options.max.constructor == Date) {
				options.max.setHours(0,0,0,0);
			}
			if (!options.select_day) {
				if (options.min) {
					options.min	= new Date(options.min);
					options.min.setDate(1);
					options.min	= options.min.valueOf();
				}
				if (options.max) {
					options.max	= new Date(options.max);
					options.max.setDate(1);
					options.max	= options.max.valueOf();
				}
			}
			if (typeof options.date === 'string') {
				options.date = parseDate(options.date, options.format, options.separator, options.locale).setHours(0,0,0,0);
			} else if (options.date.constructor == Date) {
				options.date.setHours(0,0,0,0);
			}
			if (!options.date) {
				options.date = new Date;
				options.date.setHours(0,0,0,0);
			}
			if (options.mode != 'single') {
				if (options.date.constructor != Array) {
					options.date = [options.date.valueOf()];
					if (options.mode == 'range') {
						options.date.push(((new Date(options.date[0])).setHours(0,0,0,0)).valueOf());
					}
				} else {
					for (i = 0; i < options.date.length; i++) {
						options.date[i] = (parseDate(options.date[i], options.format, options.separator, options.locale).setHours(0,0,0,0)).valueOf();
					}
					if (options.mode == 'range') {
						options.date[1] = ((new Date(options.date[1])).setHours(0,0,0,0)).valueOf();
					}
				}
				options.current	= new Date(options.date[0]);
				// Set days to 1 in order to handle them consistently
				if (!options.select_day) {
					for (i = 0; i < options.date.length; ++i) {
						options.date[i]	= new Date(options.date[i]);
						options.date[i].setDate(1);
						options.date[i]	= options.date[i].valueOf();
						// Remove duplicates
						if (
							options.mode != 'range' &&
							options.date.indexOf(options.date[i]) !== i
						) {
							delete options.date.splice(i, 1);
							--i;
						}
					}
				}
			} else {
				options.date	= options.date.valueOf();
				options.current	= new Date(options.date);
				if (!options.select_day) {
					options.date	= new Date(options.date);
					options.date.setDate(1);
					options.date	= options.date.valueOf();
				}
			}
			options.current.setDate(1);
			options.current.setHours(0,0,0,0);
			var cnt,
				pickmeup = $(tpl.wrapper);
			this.pickmeup	= pickmeup;
			if (options.class_name) {
				pickmeup.addClass(options.class_name);
			}
			var html = '';
			for (i = 0; i < options.calendars; i++) {
				cnt		= options.first_day;
				html	+= tpl.head({
					prev	: options.prev,
					next	: options.next,
					day		: [
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7],
						options.locale.daysMin[(cnt++) % 7]
					]
				});
			}
			$this.data('pickmeup-options', options);
			for (i in options) {
				if (['render', 'change', 'before_show', 'show', 'hide'].indexOf(i) != -1) {
					options[i]	= options[i].bind(this);
				}
			}
			options.binded	= {
				fill		: fill.bind(this),
				update_date	: update_date.bind(this),
				click		: click.bind(this),
				show		: show.bind(this),
				forced_show	: forced_show.bind(this),
				hide		: hide.bind(this),
				update		: update.bind(this),
				clear		: clear.bind(this),
				prev		: prev.bind(this),
				next		: next.bind(this),
				get_date	: get_date.bind(this),
				set_date	: set_date.bind(this),
				destroy		: destroy.bind(this)
			};
			options.events_namespace	= '.pickmeup-' + (++instances_count);
			pickmeup
				.on('click touchstart', options.binded.click)
				.addClass(views[options.view])
				.append(html)
				.on(
					$.support.selectstart ? 'selectstart' : 'mousedown',
					function(e){
						e.preventDefault();
					}
				);
			options.binded.fill();
			if (options.flat) {
				pickmeup.appendTo(this).css({
					position	: 'relative',
					display		: 'inline-block'
				});
			} else {
				pickmeup.appendTo(document.body);
				// Multiple events support
				var trigger_event	= options.trigger_event.split(' ');
				for (i = 0; i < trigger_event.length; ++i) {
					trigger_event[i]	+= options.events_namespace;
				}
				trigger_event	= trigger_event.join(' ');
				$this.on(trigger_event, options.binded.show);
			}
		});
	};
}));
(function() {
  if (window.JST == null) {
    window.JST = {};
  }

  window.JST['rental_agreements/form_intro'] = function(context) {
    return (function() {
      var $c, $e, $o;
      $e = window.HAML.escape;
      $c = window.HAML.cleanValue;
      $o = [];
      $o.push("<div id='intro-form'>\n<div class='intro-inner'>\n<div class='intro-icon ra-edit-icons'></div>\n<div class='title'>Hi " + this.data.user_name + "!</div>\n<div class='text'>Get started creating your customised rental agreement, all online!\n<br>Just answer basic questions and an agreement will be generated for you.</br>\n</div>\nChoose a section from the menu on the left");
      if (this.step_name) {
        $o.push(", or\n<button class='btn btn-focus intro-action-btn primary' data-id='" + ($e($c(this.data.last_step_id))) + "'>");
        if (this.is_first_step) {
          $o.push("Begin with " + this.step_name + " Section");
        } else {
          $o.push("Continue with " + this.step_name + " Section");
        }
        $o.push("</button>\n<div class='keyboard-help'>\nor press\n<span class='tab-key'>Enter</span>\n</div>");
      }
      $o.push("</div>\n</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(window.HAML.context(context));
  };

}).call(this);

define("backbone/templates/rental_agreements/_form_intro", function(){});

(function() {
  if (window.JST == null) {
    window.JST = {};
  }

  window.JST['rental_agreements/form_step_wrap'] = function(context) {
    return (function() {
      var $c, $e, $o, class_name, current_section, diff_id, i, j, k, len, len1, ref, ref1, section, skipped, step_icon_map;
      $e = window.HAML.escape;
      $c = window.HAML.cleanValue;
      $o = [];
      if (this.step.name) {
        current_section = this.step.name.split(' ')[0].toLowerCase();
      }
      $o.push("<div class='form-main'>");
      ref = this.step.agreement_step_sections;
      for (j = 0, len = ref.length; j < len; j++) {
        section = ref[j];
        if (section.is_repeatable) {
          ref1 = section.diffs;
          for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
            diff_id = ref1[i];
            $o.push("" + $c(this.render('rental_agreements/form_main', {
              section: section,
              diff_id: diff_id,
              toggled: this.toggled,
              city_id: this.city_id
            })));
          }
        } else {
          $o.push("" + $c(this.render('rental_agreements/form_main', {
            section: section,
            optional_clauses: this.optional_clauses,
            sdr_values: this.sdr_values,
            last_sdr: this.last_sdr,
            toggled: this.toggled,
            skipped_once: this.skipped_once
          })));
        }
      }
      if (this.is_final_step || this.is_second_last_step) {
        class_name = 'incomplete-steps';
      } else {
        class_name = '';
      }
      if (this.step.denom && this.step.num === this.step.denom) {
        class_name += ' complete';
      }
      if (this.skipped_once) {
        skipped = ' visible';
      } else {
        skipped = '';
      }
      $o.push("<div class='" + (['form-feedback', "" + ($e($c(class_name + ' ' + current_section + skipped)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'>\n<div class='" + (['step-complete-icon', 'ra-edit-icons', "" + ($e($c(current_section)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'></div>\n<div class='" + (['step-incomplete-icon', 'ra-edit-icons', "" + ($e($c(current_section)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'></div>\n<div class='" + (['incomplete-steps-icon', 'ra-edit-icons', "" + ($e($c(current_section)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'></div>\n<div class='ra-edit-icons rental-agreement-complete-icon'></div>\n<div class='feedback'>");
      if (!this.is_final_step && !this.is_second_last_step) {
        $o.push("<div class='incomplete-header'>\n<div class='h6'>" + this.step.name + " section incomplete!</div>");
        if (this.is_final_step) {
          $o.push("<div class='text'>Please complete the incomplete sections. You can also add addtional clauses from above.</div>");
        } else {
          $o.push("<div class='text'>Please complete " + this.step.name + " section now or continue to " + this.next_step_name + " section.</div>");
        }
        $o.push("</div>\n<div class='complete-header'>\n<div class='h6'>" + ($e($c(this.step.name))) + "\nsection complete!\n</div>");
        if (this.is_final_step) {
          $o.push("<div class='text'>Awesome! Add another clause or pick another section from the side menu.</div>");
        } else {
          $o.push("<div class='text'>Awesome!</div>");
        }
        $o.push("</div>");
      }
      $o.push("<div class='rental-agreement-complete-header'>\n<div class='h6'>\nAgreement ready to be reviewed!\n</div>\n<div class='text'>\nYou can review your agreement or explore Additional Clauses (optional).\n</div>\n</div>");
      if (this.is_final_step || this.is_second_last_step) {
        $o.push("<div class='incomplete-steps-header'>\n<div class='h6'>Agreement incomplete!</div>");
        if (this.is_final_step) {
          $o.push("<div class='text'>Your agreement is incomplete. Please complete it now.</div>");
        } else if (this.is_second_last_step) {
          $o.push("<div class='text'>Your agreement is incomplete. You can complete it now or explore Additional Clauses (optional).</div>");
        }
        $o.push("</div>");
      }
      if (!this.is_final_step && !this.is_second_last_step) {
        $o.push("<button class='btn btn-focus goto-next-step primary' type='button'>Continue to " + this.next_step_name + " section</button>");
      }
      if (!this.is_final_step) {
        $o.push("<button class='btn btn-focus goto-add-clause' type='button'>Go to Additional Clauses</button>");
      }
      if (this.is_second_last_step || this.is_final_step) {
        $o.push("<button class='btn btn-focus finish-incomplete primary'>Complete Agreement</button>");
      }
      $o.push("<button class='btn btn-focus review-agreement-btn review-btn secondary' type='button'>\n<i class='icon-thin-tick'></i>\nReview Agreement\n</button>\n</div>\n</div>\n</div>");
      step_icon_map = {};
      step_icon_map["Commercials"] = "icon-ra-commercials";
      step_icon_map["Tenant"] = "icon-ra-tenant";
      step_icon_map["Landlord"] = "icon-landlord";
      step_icon_map["Witness"] = "icon-male-user";
      step_icon_map["Property"] = "icon-ra-property";
      step_icon_map["Additional Clauses (optional)"] = "icon-ra-optional-clause";
      $o.push("<div class='step-header'>\n<div class='step-image'>\n<i class='" + step_icon_map[this.step.name] + "'></i>\n</div>\n<div class='step-title-wrap'>\n<div class='step-title'>" + ($e($c(this.step.name))) + "</div>\n<div class='step-progress-bar'>\n<div class='" + (['step-progress', "" + ($e($c(this.step.num === this.step.denom ? 'complete' : void 0)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "' style='width:" + ($e($c(48 * this.step.num / this.step.denom))) + "px;'></div>\n</div>\n<div class='hiding-fields'>\n<div class='section-description'>" + ($e($c(this.step.description))) + "</div>\n</div>\n<div class='hidden hidden-fields'></div>\n</div>\n<div class='header-border hide'></div>\n</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(window.HAML.context(context));
  };

}).call(this);

define("backbone/templates/rental_agreements/_form_step_wrap", function(){});

(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (window.JST == null) {
    window.JST = {};
  }

  window.JST['rental_agreements/form_main'] = function(context) {
    return (function() {
      var $c, $e, $o, answer, checked, custom_name, custom_value, disabled, field_class, i, j, k, l, len, len1, len2, len3, m, n, name, option, ques_class, question, ref, ref1, ref2, ref3, ref4, ref5, show_clauses, value;
      $e = window.HAML.escape;
      $c = window.HAML.cleanValue;
      $o = [];
      if (!this.diff_id) {
        this.diff_id = '';
      }
      if (this.section.is_optional) {
        if (!this.section.optional_shown) {
          return;
        }
      }
      $o.push("<div class='" + (['section-wrap', "" + ($e($c(this.section.is_optional ? 'optional-questions' : void 0)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "' data-section-id='" + ($e($c(this.section.id))) + "' data-diff-id='" + ($e($c(this.diff_id))) + "'>\n<div class='section-head'>\n<span class='" + (['section-title', "" + ($e($c(this.section.is_repeatable ? 'repeatable' : void 0)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'>");
      $o.push("" + $e($c(this.section.name)));
      $o.push("</span>");
      if (this.section.is_repeatable || this.section.is_optional) {
        $o.push("<span class='delete-section'>Remove</span>");
      }
      $o.push("</div>\n<ol class='questions-wrap'>");
      ref = this.section.agreement_step_section_questions;
      for (j = 0, len = ref.length; j < len; j++) {
        question = ref[j];
        ques_class = '';
        if (this.diff_id) {
          if (question.hidden_diff && question.hidden_diff[this.diff_id]) {
            ques_class += ' collapsed';
          }
        } else if (question.hidden) {
          ques_class += ' collapsed';
        }
        if (question.question_type_name === 'Sub Heading') {
          $o.push("<div class='" + (['sub-heading', 'question-container', "" + ($e($c(ques_class)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "' data-ques-id='" + ($e($c(question.id))) + "'>" + ($e($c(question.name))) + "</div>");
          continue;
        }
        answer = null;
        if (this.section.is_repeatable) {
          answer = question.answer_diff[this.diff_id];
        } else {
          answer = question.answer;
        }
        if (question.tag === 'CustomNumeric') {
          answer = answer ? JSON.parse(answer) : {};
          for (custom_name in answer) {
            custom_value = answer[custom_name];
            $o.push("<li class='" + (['question-container', 'form-element', 'border-less', 'inline-numeric', 'custom-numeric', "" + ($e($c(ques_class)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "' data-ques-id='" + ($e($c(question.id))) + "'>\n<input class='add-another input' type='text' value='" + ($e($c(custom_name))) + "' placeholder='Add Another'>\n<button class='minus-btn'>-</button>\n<input class='input numeric' value='" + ($e($c(custom_value))) + "' type='number' min='0' pattern='" + ($e($c(question.regex))) + "'>\n<button class='plus-btn'>+</button>\n</li>");
          }
          $o.push("<li class='" + (['question-container', 'form-element', 'border-less', 'inline-numeric', 'custom-numeric', 'custom-numeric-add', "" + ($e($c(ques_class)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "' data-ques-id='" + ($e($c(question.id))) + "'>\n<input class='add-another input' type='text' placeholder='Add Another'>\n<button class='minus-btn'>-</button>\n<input class='input numeric' type='number' min='0' pattern='" + ($e($c(question.regex))) + "'>\n<button class='plus-btn'>+</button>\n</li>");
          continue;
        }
        ques_class += (function() {
          switch (question.tag) {
            case 'Add-Repeatable':
              return ' add-repeatable';
            case 'City':
              return ' disabled';
            default:
              return '';
          }
        })();
        ques_class += (function() {
          switch (question.question_type_name) {
            case 'Image Radio':
              return ' has-icons';
            case 'Furnishing':
              return ' inline-numeric';
            default:
              return '';
          }
        })();
        $o.push("<li class='" + (['question-container', 'form-element', 'border-less', "" + ($e($c(ques_class)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "' data-ques-id='" + ($e($c(question.id))) + "'>\n<div class='question-info'>\n<div class='question-text'>" + ($e($c(question.name))) + "</div>");
        if (question.info) {
          $o.push("<button class='open-right tooltipped' data-title='" + ($e($c(question.info))) + "'>\n<span class='icon-info'></span>\n</button>");
        }
        $o.push("</div>");
        if (question.tag === 'Choose-Optional') {
          show_clauses = this.optional_clauses.length > 5;
          $o.push("<div class='" + (['optional-container', "" + ($e($c(!this.toggled ? "list-collapsed" : void 0)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'>");
          answer = answer ? JSON.parse(answer) : {};
          ref1 = this.optional_clauses;
          for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
            option = ref1[i];
            checked = (ref2 = option.id, indexOf.call(answer, ref2) >= 0);
            name = option.name.replace(/\s/g, '');
            $o.push("<input class='input' id='" + ($e($c(question.id + '-' + this.diff_id + '-' + name))) + "' type='checkbox' value='" + ($e($c(option.id))) + "' name='" + ($e($c(question.id + '-' + this.diff_id + '-' + name))) + "' checked='" + ($e($c(checked))) + "'>\n<label class='" + ($e($c(i > 5 ? "label-collapsed" : void 0))) + "' data-index='" + ($e($c(i + 1))) + "' for='" + ($e($c(question.id + '-' + this.diff_id + '-' + name))) + "'>" + ($e($c(option.name))));
            if (option.description) {
              $o.push("<div class='label-tooltip open-right tooltipped' data-title='" + ($e($c(option.description))) + "'></div>");
            }
            $o.push("<div class='tick-container'>\n<span class='icon-thin-tick'></span>\n</div>\n</label>");
          }
          $o.push("</div>\n<a class='" + (['show-clauses', "" + ($e($c(this.toggled || !show_clauses ? "hide" : void 0)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'>+ View all clauses</a>\n<div class='add-step'>\n<button class='add-clause btn primary'>Update Additional Clauses</button>\n<button class='" + (['btn', 'primary', 'bordered', 'skip-clause', "" + ($e($c(this.skipped_once ? 'hide' : void 0)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'>Skip Section</button>\n</div>");
        } else if (question.question_type_name === "Text") {
          disabled = question.tag === 'City';
          if (question.before_placeholder_text) {
            $o.push("<span class='before-ph'>" + ($e($c(question.before_placeholder_text))) + "</span>");
          }
          field_class = [];
          if (question.formatting === 'Uppercase') {
            field_class.push('uppercase');
          }
          field_class = field_class.join(' ');
          $o.push("<input class='" + (['input', "" + ($e($c(field_class)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "' placeholder='" + ($e($c(question.placeholder))) + "' required='" + ($e($c(question.is_mandatory))) + "' value='" + ($e($c(answer))) + "' pattern='" + ($e($c(question.regex))) + "' disabled='" + ($e($c(disabled))) + "'>");
          if (question.after_placeholder_text) {
            $o.push("<span class='before-ph'>" + ($e($c(question.after_placeholder_text))) + "</span>");
          }
        } else if (question.question_type_name === "Numeric" || question.question_type_name === "Furnishing") {
          value = answer || 0;
          $o.push("<button class='minus-btn'>-</button>\n<input class='input numeric' value='" + ($e($c(value))) + "' type='number' min='0' pattern='" + ($e($c(question.regex))) + "'>\n<button class='plus-btn'>+</button>");
        } else if (question.question_type_name === "Radio") {
          ref3 = question.options;
          for (i = l = 0, len2 = ref3.length; l < len2; i = ++l) {
            option = ref3[i];
            checked = option.name === answer;
            $o.push("<input class='input' id='" + ($e($c(question.id + '-' + this.diff_id + '-' + option.name))) + "' type='radio' value='" + ($e($c(option.name))) + "' name='" + ($e($c(question.id + '-' + this.diff_id))) + "' checked='" + ($e($c(checked))) + "'>\n<label data-index='" + ($e($c(i + 1))) + "' for='" + ($e($c(question.id + '-' + this.diff_id + '-' + option.name))) + "'>" + ($e($c(option.name))) + "\n<div class='tick-container'>\n<span class='icon-thin-tick'></span>\n</div>\n</label>");
          }
        } else if (question.question_type_name === "Image Radio") {
          ref4 = question.options;
          for (i = m = 0, len3 = ref4.length; m < len3; i = ++m) {
            option = ref4[i];
            checked = option.name === answer;
            $o.push("<input class='input' id='" + ($e($c(question.id + '-' + this.diff_id + '-' + option.name))) + "' type='radio' value='" + ($e($c(option.name))) + "' name='" + ($e($c(question.id + '-' + this.diff_id))) + "' checked='" + ($e($c(checked))) + "'>\n<label class='has-icon' data-index='" + ($e($c(i + 1))) + "' for='" + ($e($c(question.id + '-' + this.diff_id + '-' + option.name))) + "'>" + ($e($c(option.name))) + "\n<i class='icon-" + option.imgcode + "'></i>\n<div class='tick-container'>\n<span class='icon-thin-tick'></span>\n</div>\n</label>");
          }
        } else if (question.question_type_name === 'Date') {
          $o.push("<input class='input' placeholder='" + ($e($c(question.placeholder))) + "' required='" + ($e($c(question.is_mandatory))) + "' value='" + ($e($c(answer))) + "' pattern='^(0?[1-9]|[12][0-9]|3[01])\\/(0?[1-9]|1[012])\\/\\d{4}$'>\n<div class='" + (['calendar-wrap', "" + ($e($c(question.formatting === 'AfterToday' ? 'calendar-after-today' : 'calendar-date')))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'></div>");
        } else if (question.question_type_name === 'Day of Month') {
          $o.push("<input class='input' placeholder='" + ($e($c(question.placeholder))) + "' required='" + ($e($c(question.is_mandatory))) + "' value='" + ($e($c(answer))) + "' pattern='^0*([0-9]|[12][0-9]|30)$'>\n<div class='calendar-day calendar-wrap'></div>");
        }
        $o.push("<div class='help-text'>");
        if (question.question_type_name === "Text") {
          $o.push("<span class='begin-input'>\n<span>" + ($e($c(question.helper_text))) + "</span>\n<span class='keyboard-help'>\nHit\n<span class='keyboard-key'>tab</span>\nwhen ready to continue.\n</span>\n</span>\n<span class='validation-error'>\n<span class='red-error'>" + ($e($c(question.validation_error_message))) + "</span>\n<span class='keyboard-help'>\nHit\n<span class='keyboard-key'>tab</span>\nto continue and fill later.\n</span>\n</span>\n<span class='validation-success'>\n<span>" + ($e($c(question.validation_confirm_message))) + "</span>\n<span class='keyboard-help'>\nHit\n<span class='keyboard-key'>tab</span>\nto continue.\n</span>\n</span>");
        } else if (question.question_type_name === "Radio" || question.question_type_name === "Image Radio") {
          $o.push("<span class='begin-input'>\n" + question.helper_text + "\n</span>\n<span class='validation-error'>\n" + question.validation_error_message + "\n</span>\n<span class='validation-success'>\n" + question.validation_confirm_message + "\n</span>\n<span class='keyboard-help'>\nHit");
          for (i = n = 1, ref5 = question.options.length - 1; 1 <= ref5 ? n <= ref5 : n >= ref5; i = 1 <= ref5 ? ++n : --n) {
            if (i !== 1) {
              $o.push(",");
            }
            $o.push("<span class='keyboard-key'>" + ($e($c(i))) + "</span>");
          }
          $o.push("or\n<span class='keyboard-key'>" + ($e($c(question.options.length))) + "</span>\non your keyboard to select.\n</span>");
        } else if (question.question_type_name === 'Numeric') {
          $o.push("<span class='begin-input'>\n" + question.helper_text + "\n</span>\n<span class='validation-error'>\n" + question.validation_error_message + "\n</span>\n<span class='validation-success'>\n" + question.validation_confirm_message + "\n</span>\n<span class='keyboard-help'>\nHit\n<span class='keyboard-key'><</span>\nor\n<span class='keyboard-key'>></span>\nto change.\n</span>");
        }
        $o.push("</div>\n</li>");
        if (question.tag === this.last_sdr) {
          $o.push("<li class='border-less fees form-element question stamp-duty-section'>\n<div class='clearfix'>\n<div class='ra-edit-icons stamp-icon'></div>\n<div class='content'>\n<div class='title'>Stamp duty and other charges</div>\n<div class='desc'>\n<div class='info'>");
          $o.push("" + $c(this.render('rental_agreements/sdr', {
            sdr_values: this.sdr_values
          })));
          $o.push("</div>\n<div class='help-text'>\n<span class='begin-input'>\nHit\n<span class='keyboard-key'>TAB</span>\nwhen ready to continue.\n</span>\n</div>\n</div>\n</div>\n</div>\n<input class='input' type='checkbox'>\n</li>\n<div class='hide loading-btn sdr-loading'></div>");
        }
      }
      $o.push("</ol>\n</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "").replace(/[\s\n]*\u0091/mg, '').replace(/\u0092[\s\n]*/mg, '');
    }).call(window.HAML.context(context));
  };

}).call(this);

define("backbone/templates/rental_agreements/_form_main", function(){});

(function() {
  if (window.JST == null) {
    window.JST = {};
  }

  window.JST['rental_agreements/sdr'] = function(context) {
    return (function() {
      var $c, $e, $o, amount_cls, text_cls;
      $e = window.HAML.escape;
      $c = window.HAML.cleanValue;
      $o = [];
      if (this.sdr_values) {
        text_cls = 'hide';
        amount_cls = '';
      } else {
        text_cls = '';
        amount_cls = 'hide';
      }
      $o.push("<span class='" + (['required-text', "" + ($e($c(text_cls)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'>Please complete the Commercials section to calculate stamp duty and other charges</span>\n<span class='" + (['amount', "" + ($e($c(amount_cls)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'>");
      if (this.sdr_values) {
        if (this.sdr_values.large_duration) {
          $o.push("Please seek appropriate legal advice and/or visit the offices of the concerned sub-registrar for information and assistance related to the the applicable Stamp Duty and Registration Fees for this agreement.");
        } else {
          $o.push("The applicable Stamp Duty for this agreement is Rs. " + this.sdr_values.stamp_duty);
          if (this.sdr_values.registration_fee && this.sdr_values.registration_fee !== "0") {
            $o.push("and Registration Fees is Rs. " + this.sdr_values.registration_fee);
          }
        }
      }
      $o.push("</span>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(window.HAML.context(context));
  };

}).call(this);

define("backbone/templates/rental_agreements/_sdr", function(){});

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define('backbone/views/rental_agreements/form_view',['backbone/assets', 'backbone/views/components/confirmation_modal', 'backbone/helpers/keyspy', 'backbone/helpers/smarty', 'backbone/helpers/jquery.pickmeup', 'backbone/templates/rental_agreements/_form_intro', 'backbone/templates/rental_agreements/_form_step_wrap', 'backbone/templates/rental_agreements/_form_main', 'backbone/templates/rental_agreements/_sdr'], function(Housing, ConfirmationModal, KeySpy) {
    var FormView;
    return FormView = (function(superClass) {
      extend(FormView, superClass);

      function FormView() {
        this.destroy = bind(this.destroy, this);
        this.load_sdr = bind(this.load_sdr, this);
        this.force_update_answer = bind(this.force_update_answer, this);
        this.update_sdr = bind(this.update_sdr, this);
        this.show_optional_listener = bind(this.show_optional_listener, this);
        this.show_optional_clause = bind(this.show_optional_clause, this);
        this.repeatable_max_limit = bind(this.repeatable_max_limit, this);
        this.delete_section = bind(this.delete_section, this);
        this.delete_repeatable = bind(this.delete_repeatable, this);
        this.create_new_repeatable = bind(this.create_new_repeatable, this);
        this.section_change = bind(this.section_change, this);
        this.step_update_progress = bind(this.step_update_progress, this);
        this.focus_question = bind(this.focus_question, this);
        this.goto_incomplete_question = bind(this.goto_incomplete_question, this);
        this.skip_additional_clause = bind(this.skip_additional_clause, this);
        this.add_additional_clause = bind(this.add_additional_clause, this);
        this.toggle_list = bind(this.toggle_list, this);
        this.scroll_event = bind(this.scroll_event, this);
        this.update_header = bind(this.update_header, this);
        this.update_scroll_positions = bind(this.update_scroll_positions, this);
        this.step_change = bind(this.step_change, this);
        this.cleanup_step = bind(this.cleanup_step, this);
        this.update_visibility = bind(this.update_visibility, this);
        this.post_render_gen = bind(this.post_render_gen, this);
        this.onchange = bind(this.onchange, this);
        this.bind_events = bind(this.bind_events, this);
        this.setup_calendar = bind(this.setup_calendar, this);
        this.init_calendar = bind(this.init_calendar, this);
        this.onfocus = bind(this.onfocus, this);
        this.goto_next_step = bind(this.goto_next_step, this);
        this.goto_additional_clauses = bind(this.goto_additional_clauses, this);
        this.focus_next_step_btn = bind(this.focus_next_step_btn, this);
        this.scroll_to_question = bind(this.scroll_to_question, this);
        this.render = bind(this.render, this);
        this.initialize = bind(this.initialize, this);
        return FormView.__super__.constructor.apply(this, arguments);
      }

      FormView.prototype.el = '#ra-form';

      FormView.prototype.template = {
        intro: window.JST['rental_agreements/form_intro'],
        step_wrap: window.JST['rental_agreements/form_step_wrap'],
        main: window.JST['rental_agreements/form_main'],
        sdr: window.JST['rental_agreements/sdr']
      };

      FormView.prototype.last_step = null;

      FormView.prototype.last_section = null;

      FormView.prototype.last_diff = null;

      FormView.prototype.events = {
        'click .delete-section': 'delete_section',
        'keyup .input': 'onchange',
        'click .goto-next-step': 'goto_next_step',
        'click .goto-add-clause': 'goto_additional_clauses',
        'click .intro-action-btn': 'goto_next_step',
        'click .show-clauses': 'toggle_list',
        'click .skip-clause': 'skip_additional_clause',
        'click .add-clause': 'add_additional_clause',
        'click .finish-incomplete': 'goto_incomplete_question'
      };

      FormView.prototype.initialize = function(options) {
        this.options = options || {};
        this.scroll_positions = [];
        this.header_list = [];
        if (!Housing.RentalAgreement) {
          return;
        }
        this.desktop_header_height = $('#header').outerHeight();
        this.init_calendar();
        this.render();
        this.bind_events();
        this.post_render = _.debounce(this.post_render_gen, 10);
        this.sorted_steps = Housing.RentalAgreement.sorted_steps;
        return this.additional_clause = this.sorted_steps[this.sorted_steps.length - 1];
      };

      FormView.prototype.render = function() {
        var is_first_step, step_name;
        this.smarty = this.$el.smarty({
          tooltips: false,
          onfocus: this.onfocus,
          onchange: this.onchange,
          numeric_events: true
        });
        if (Housing.RentalAgreement.data.last_step_id) {
          step_name = Housing.RentalAgreement.steps[Housing.RentalAgreement.data.last_step_id].name;
        } else {
          step_name = Housing.RentalAgreement.sorted_steps[0].name;
          is_first_step = true;
        }
        this.$el.html(this.template.intro({
          data: Housing.RentalAgreement.data,
          step_name: step_name,
          is_first_step: is_first_step
        }));
        return this.$el.find('.intro-action-btn').focus();
      };

      FormView.prototype.scroll_to_question = function($question, from_question, delta, mode) {
        var $from_question;
        $from_question = $(from_question);
        if (delta === 1 && $from_question.hasClass('add-another')) {
          $question = $from_question.siblings('.numeric');
        } else if (delta === -1 && $from_question.hasClass('numeric') && $from_question.parent().hasClass('custom-numeric')) {
          $question = $from_question.siblings('.add-another');
        }
        return $('html,body').stop().animate({
          scrollTop: $question.offset().top - (window.innerHeight - $question.outerHeight()) / 2 - this.header_height / 2
        }, {
          duration: 200,
          queue: false,
          complete: (function(_this) {
            return function() {
              _this.mode = mode;
              return $question.focus();
            };
          })(this)
        });
      };

      FormView.prototype.focus_next_step_btn = function(delta) {
        if (delta !== 1) {
          return;
        }
        return setTimeout(function() {
          return $('.goto-next-step').focus();
        }, 10);
      };

      FormView.prototype.goto_additional_clauses = function(e) {
        return Housing.RentalAgreement.step_change(this.additional_clause.id, 'card');
      };

      FormView.prototype.goto_next_step = function(e) {
        var index, j, len, ref, results, step;
        if (this.step) {
          ref = this.sorted_steps;
          results = [];
          for (index = j = 0, len = ref.length; j < len; index = ++j) {
            step = ref[index];
            if (step.id === this.step.id && (index + 1) < this.sorted_steps.length) {
              Housing.RentalAgreement.step_change(this.sorted_steps[index + 1].id, 'card');
              break;
            } else {
              results.push(void 0);
            }
          }
          return results;
        } else if ($(e.target).data('id')) {
          return Housing.RentalAgreement.step_change($(e.target).data('id'), 'intro-btn');
        } else {
          return Housing.RentalAgreement.step_change(this.sorted_steps[0].id, 'intro-btn');
        }
      };

      FormView.prototype.onfocus = function(e) {
        var diff_id, section, section_id;
        this.last_question = parseInt($(e.target).closest('.question-container').data('ques-id'));
        section = $(e.target).closest('.section-wrap');
        diff_id = section.data('diff-id') || null;
        section_id = section.data('section-id');
        if ((!this.last_section) || (section_id !== this.last_section) || (diff_id && this.last_diff && diff_id !== this.last_diff)) {
          this.last_section = section_id;
          this.last_diff = diff_id || null;
          Housing.RentalAgreement.section_change(section_id, diff_id, this.mode || 'scroll');
        }
        return this.mode = null;
      };

      FormView.prototype.init_calendar = function() {
        this.pickmeup_date_options = {
          format: 'd/m/Y',
          flat: 'true',
          first_day: 0,
          prev: '<i class="icon-arrow-left"></i>',
          next: '<i class="icon-arrow-right"></i>',
          locale: {
            daysMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S', 'S']
          },
          change: (function(_this) {
            return function() {
              var cal_pmu = $(this);
              var ev, target;
              target = $(cal_pmu).siblings('.input').val(cal_pmu.pickmeup('get_date', true)).focus();
              ev = document.createEvent('Event');
              ev.initEvent('input', true, true);
              if (target[0].dispatchEvent) {
                target[0].dispatchEvent(ev);
              }
              return _this.onchange({
                target: target
              });
            };
          })(this)
        };
        this.pickmeup_day_options = _.extend({}, this.pickmeup_date_options, {
          format: 'd',
          first_day: 1,
          date: new Date(1435700116084)
        });
        return this.pickmeup_after_today_options = _.extend({}, this.pickmeup_date_options, {
          min: new Date()
        });
      };

      FormView.prototype.setup_calendar = function() {
        this.calendar_after_today_fields = this.$el.find('.calendar-wrap.calendar-after-today').pickmeup(this.pickmeup_after_today_options);
        this.calendar_date_fields = this.$el.find('.calendar-wrap.calendar-date').pickmeup(this.pickmeup_date_options);
        return this.calendar_day_fields = this.$el.find('.calendar-wrap.calendar-day').pickmeup(this.pickmeup_day_options);
      };

      FormView.prototype.bind_events = function() {
        return this.keyspy = new KeySpy({
          parent: '#ra-form',
          vertical_criterion: (function(_this) {
            return function() {
              return !(_this.keyspy.target && $(_this.keyspy.target).closest('.form-element').hasClass('has-icons'));
            };
          })(this),
          onchange: this.onchange,
          focus_question: this.scroll_to_question,
          on_out_of_range: this.focus_next_step_btn
        });
      };


      /*
      			Called on updating answers(keyup event), from keyspy(select_element method),
      			pickmeup calendar, smarty and delete_section method(triggers click event on optional clauses asnswers)
       */

      FormView.prototype.onchange = function(e) {
        var $elem, $new_question, $question_wrap, $section_wrap, answer, custom_name, diff_id, j, len, name, ques_id, question, radio_elem, section_id;
        if (e.type === 'keyup' && e.which === 9) {
          return;
        }
        if (e.mode) {
          this.mode = e.mode;
        }
        $elem = $(e.target);
        $section_wrap = $elem.closest('.section-wrap');
        diff_id = $section_wrap.data('diff-id');
        section_id = $section_wrap.data('section-id');
        $question_wrap = $elem.closest('.question-container');
        ques_id = $question_wrap.data('ques-id');
        if ($question_wrap.hasClass('custom-numeric')) {
          if ($question_wrap.hasClass('custom-numeric-add')) {
            answer = $elem.val();
            if (answer) {
              $new_question = $question_wrap.clone();
              $new_question.find('.add-another').val('');
              $new_question.removeClass('focused mature invalid');
              $question_wrap.after($new_question);
              $question_wrap.removeClass('custom-numeric-add');
            }
          } else {
            custom_name = $question_wrap.find('.add-another').val();
            if (!custom_name) {
              $section_wrap.find('.custom-numeric-add').remove();
              $question_wrap.addClass('custom-numeric-add');
              $question_wrap.nextAll('.custom-numeric').insertBefore($question_wrap);
            }
          }
          answer = {};
          $question_wrap.siblings('.custom-numeric:not(.custom-numeric-add)').andSelf().each(function(i, question) {
            var $question, custom_num;
            $question = $(question);
            custom_name = $question.find('.add-another').val();
            custom_num = $question.find('.numeric').val();
            return answer[custom_name] = custom_num;
          });
          answer = JSON.stringify(answer);
        } else if ($elem.is('[type=checkbox]')) {
          $elem = $elem.parent().children('.input:checked');
          answer = [];
          for (j = 0, len = $elem.length; j < len; j++) {
            radio_elem = $elem[j];
            answer.push(parseInt($(radio_elem).val()));
          }
          answer = JSON.stringify(answer);
        } else {
          if ($elem.is('[type=radio]')) {
            name = $elem.attr('name');
            $elem = this.$el.find('input[name="' + name + '"]:checked');
          }
          answer = $elem.val();
        }
        if ($question_wrap.hasClass('add-repeatable') && answer === 'Yes') {
          if (!this.repeatable_section) {
            return;
          }
          if (e.mode === 'next' || e.mode === 'arrow') {
            return;
          }
          $elem.prop('checked', false);
          $elem.siblings('.input[value="No"]').prop('checked', true);
          Housing.RentalAgreement.create_new_repeatable(this.repeatable_section);
          return false;
        }
        question = Housing.RentalAgreement.questions[ques_id];
        if (question && question.tag === 'Choose-Optional') {
          this.clauses = {
            ques_id: ques_id,
            answer: answer,
            diff_id: diff_id
          };
        } else {
          Housing.RentalAgreement.set_answer(ques_id, answer, diff_id);
        }
        return true;
      };

      FormView.prototype.post_render_gen = function() {
        if (this.destroyed) {
          return;
        }
        this.setup_calendar();
        this.update_scroll_positions();
        return this.current_element = null;
      };

      FormView.prototype.update_visibility = function(step_id, section_id, ques_id, diff_id, hide) {
        var selector;
        if (step_id !== this.last_step) {
          return;
        }
        selector = '.section-wrap[data-section-id="' + section_id + '"]';
        if (diff_id) {
          selector = '[data-diff-id="' + diff_id + '"]';
        }
        selector += ' .question-container[data-ques-id="' + ques_id + '"]';
        this.$el.find(selector)[hide ? 'addClass' : 'removeClass']('collapsed');
        return this.post_render();
      };

      FormView.prototype.cleanup_step = function() {
        if (this.calendar_date_fields) {
          this.calendar_date_fields.pickmeup('destroy');
          this.calendar_date_fields = null;
        }
        if (this.calendar_day_fields) {
          this.calendar_day_fields.pickmeup('destroy');
          this.calendar_day_fields = null;
        }
        if (this.calendar_after_today_fields) {
          this.calendar_after_today_fields.pickmeup('destroy');
          return this.calendar_after_today_fields = null;
        }
      };

      FormView.prototype.step_change = function(step_id) {
        var diff_id, is_final_step, is_second_last_step, j, k, l, len, len1, len2, length, ref, ref1, ref2, section;
        this.step = Housing.RentalAgreement.get_step_details(step_id);
        if (!this.step) {
          return;
        }
        if (step_id === this.last_step) {
          return;
        }
        if (this.step) {
          this.cleanup_step();
        }
        this.last_step = step_id;
        length = this.sorted_steps.length;
        is_final_step = this.sorted_steps[length - 1].id === step_id;
        if (!is_final_step) {
          is_second_last_step = this.sorted_steps[length - 2].id === step_id;
        }
        this.$el.html(this.template.step_wrap({
          step: this.step,
          is_final_step: is_final_step,
          optional_clauses: Housing.RentalAgreement.optional_clauses,
          sdr_values: Housing.RentalAgreement.sdr_values,
          last_sdr: Housing.RentalAgreement.last_sdr,
          next_step_name: !is_final_step ? this.sorted_steps[this.sorted_steps.indexOf(_.find(this.sorted_steps, {
            id: this.last_step
          })) + 1].name : void 0,
          is_second_last_step: is_second_last_step,
          skipped_once: this.skipped_once,
          toggled: this.toggled
        }));
        this.header_height = this.$el.find('.step-header').outerHeight();
        this.$el.find('.form-main').css('padding-top', this.header_height);
        this.smarty.smarty('refresh');
        ref = this.step.agreement_step_sections;
        for (j = 0, len = ref.length; j < len; j++) {
          section = ref[j];
          if (!section.is_repeatable && section.num) {
            this.$el.find('.section-wrap[data-section-id="' + section.id + '"] .form-element').addClass('mature');
          } else if (section.is_repeatable) {
            ref1 = section.diffs;
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              diff_id = ref1[k];
              if (section.num_diff[diff_id]) {
                this.$el.find('.section-wrap[data-section-id="' + section.id + '"][data-diff-id="' + diff_id + '"] .form-element').addClass('mature');
              }
            }
          }
        }
        this.repeatable_section = null;
        ref2 = this.step.agreement_step_sections;
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          section = ref2[l];
          if (section.is_repeatable) {
            this.repeatable_section = section.id;
            this.repeatable_max_limit(section);
          }
        }
        this.last_section = this.step.agreement_step_sections[0];
        this.last_diff = this.step.agreement_step_sections[0].is_repeatable ? this.step.agreement_step_sections[0].diffs[0] : null;
        return this.post_render_gen();
      };

      FormView.prototype.update_scroll_positions = function() {
        var self;
        if ($('.section-wrap').length) {
          self = this;
          this.scroll_positions = [$('.section-wrap').eq(0).offset().top];
          this.header_list = [];
          return this.$el.find('.section-wrap').each(function(element) {
            if ($(this).hasClass('optional')) {
              if ($(this).hasClass('shown')) {
                self.scroll_positions.push($(this).offset().top + $(this).outerHeight());
                return self.header_list.push(this);
              }
            } else {
              self.scroll_positions.push($(this).offset().top + $(this).outerHeight());
              return self.header_list.push(this);
            }
          });
        }
      };

      FormView.prototype.update_header = function(index) {
        if (index != null) {
          this.$el.find('.hidden-fields').html($(this.header_list).find('.section-head .section-title').eq(index).html());
          this.$el.find('.hiding-fields').addClass('hidden');
          this.$el.find('.hidden-fields').removeClass('hidden');
          return this.$el.find('.header-border').removeClass('hide');
        } else {
          this.$el.find('.hiding-fields').removeClass('hidden');
          this.$el.find('.hidden-fields').addClass('hidden');
          return this.$el.find('.header-border').addClass('hide');
        }
      };

      FormView.prototype.scroll_event = function(e, scrollTop) {
        var curr_position, i;
        curr_position = scrollTop + this.header_height + this.desktop_header_height;
        i = 0;
        if (curr_position < this.scroll_positions[0]) {
          this.update_header();
          this.current_element = -1;
        } else {
          while (i < this.scroll_positions.length) {
            if (curr_position > this.scroll_positions[i] && curr_position < this.scroll_positions[i + 1]) {
              if (this.current_element) {
                if (this.current_element !== i) {
                  this.current_element = i;
                  this.update_header(i);
                  return true;
                }
              } else {
                this.current_element = i;
                this.update_header(i);
                return true;
              }
            }
            i++;
          }
        }
        return true;
      };

      FormView.prototype.toggle_list = function(e) {
        var optionalContainer;
        $(e.currentTarget).hide();
        optionalContainer = this.$el.find('.optional-container');
        optionalContainer.removeClass('list-collapsed');
        this.toggled = true;
        return false;
      };

      FormView.prototype.add_additional_clause = function() {
        if (this.clauses && this.clauses.answer) {
          Housing.RentalAgreement.set_answer(this.clauses.ques_id, this.clauses.answer, this.clauses.diff_id);
          return setTimeout((function(_this) {
            return function() {
              var $first_optional;
              $first_optional = _this.$el.find('.optional-questions .form-element').eq(0);
              if ($first_optional.length) {
                _this.scroll_to_question($first_optional, null, null);
              }
              _this.$el.find('.skip-clause').addClass('hide');
              _this.$el.find('.form-feedback.additional').addClass('visible');
              return _this.skipped_once = true;
            };
          })(this), 0);
        }
      };

      FormView.prototype.skip_additional_clause = function() {
        this.skipped_once = true;
        this.$el.find('.form-feedback.additional').addClass('visible');
        return this.scroll_to_question(this.$el.find('.form-feedback.additional'), null, null);
      };

      FormView.prototype.goto_incomplete_question = function(e, from_bar) {
        if (from_bar) {
          Housing.RentalAgreement.next_incomplete_question(this.last_step, this.last_section, this.last_diff, this.last_question);
        } else {
          Housing.RentalAgreement.next_incomplete_question();
        }
        return $('.finish-bar').removeClass('hidden');
      };

      FormView.prototype.focus_question = function(section_id, diff_id, question_id) {
        var selector;
        selector = '';
        if (diff_id) {
          selector += '.section-wrap[data-section-id="' + section_id + '"][data-diff-id="' + diff_id + '"] ';
        }
        selector += '.question-container[data-ques-id="' + question_id + '"] .input';
        return this.scroll_to_question(this.$el.find(selector).eq(0));
      };

      FormView.prototype.step_update_progress = function(step_id, num, denom) {
        if (denom && num === denom) {
          this.$el.find('.form-feedback').addClass('complete');
        } else {
          this.$el.find('.form-feedback').removeClass('complete');
        }
        return this.$el.find('.step-progress')[num === denom ? 'addClass' : 'removeClass']('complete').css('width', Math.min(48, 48 * num / denom) + 'px');
      };

      FormView.prototype.section_change = function(section_id, diff_id) {
        this.section = section_id && Housing.RentalAgreement.sections[section_id];
        if (!this.section) {
          this.section = this.step.agreement_step_sections[0];
          section_id = this.section.id;
        }
        if ((section_id !== this.last_section) || (diff_id && this.last_diff && diff_id !== this.last_diff)) {
          if (diff_id) {
            this.scroll_to_question(this.$el.find('.section-wrap[data-section-id="' + section_id + '"][data-diff-id="' + diff_id + '"] .form-element:not(.collapsed) .input').eq(0));
          } else {
            this.scroll_to_question(this.$el.find('.section-wrap[data-section-id="' + section_id + '"] .form-element:not(.collapsed) .input').eq(0));
          }
        }
        this.last_section = section_id;
        this.last_diff = diff_id;
        return this.$el.find('.hidden-fields').html(this.section.name);
      };

      FormView.prototype.create_new_repeatable = function(section_id, diff_id) {
        var section;
        section = Housing.RentalAgreement.get_section_details(section_id);
        if (!section) {
          return;
        }
        if (section.step_id !== this.last_step) {
          return;
        }
        this.$el.find('.section-wrap').last().before(this.template.main({
          section: section,
          diff_id: diff_id,
          toggled: this.toggled,
          city_id: Housing.RentalAgreement.data.city_id
        }));
        this.repeatable_max_limit(section);
        return this.post_render();
      };

      FormView.prototype.delete_repeatable = function(section_id, diff_id) {
        var section;
        section = Housing.RentalAgreement.get_section_details(section_id);
        if (!section) {
          return;
        }
        this.$el.find('.section-wrap[data-section-id="' + section_id + '"][data-diff-id="' + diff_id + '"]').remove();
        return this.repeatable_max_limit(section);
      };

      FormView.prototype.delete_section = function(e) {
        var $elem, diff_id, section, section_id, section_wrap;
        $elem = $(e.currentTarget);
        section_wrap = $elem.closest('.section-wrap');
        diff_id = section_wrap.data('diff-id');
        section_id = section_wrap.data('section-id');
        section = Housing.RentalAgreement.get_section_details(section_id);
        if (section.is_repeatable) {
          this.confirm(function() {
            return Housing.RentalAgreement.delete_repeatable(section_id, diff_id);
          });
        } else if (section.is_optional) {
          this.confirm((function(_this) {
            return function() {
              $('.optional-container input[value=' + section_id + ']').trigger('click');
              return _this.add_additional_clause();
            };
          })(this));
        }
        return false;
      };

      FormView.prototype.confirm = function(confirm_callback) {
        return new ConfirmationModal({
          onconfirm: confirm_callback,
          text: {
            confirm: 'Yes',
            cancel: 'No'
          }
        });
      };

      FormView.prototype.repeatable_max_limit = function(section) {
        if (section.diffs.length >= Housing.RentalAgreement.MAX_REPEATABLE) {
          return this.$el.find('.section-wrap').last().addClass('collapsed');
        } else {
          return this.$el.find('.section-wrap').last().removeClass('collapsed');
        }
      };

      FormView.prototype.show_optional_clause = function(section_id, show) {
        var section;
        if (show == null) {
          show = true;
        }
        if (!this.last_step) {
          return;
        }
        section = Housing.RentalAgreement.get_section_details(section_id);
        if (!section) {
          return;
        }
        if (parseInt(this.last_step) !== section.step_id) {
          return;
        }
        if (show) {
          this.$el.find('.form-feedback').before(this.template.main({
            section: section,
            toggled: this.toggled,
            city_id: Housing.RentalAgreement.data.city_id
          }));
        } else {
          this.$el.find('.section-wrap[data-section-id="' + section_id + '"]').remove();
        }
        return this.post_render();
      };

      FormView.prototype.show_optional_listener = function(e) {
        var $el, section_id, show;
        $el = $(e.currentTarget);
        section_id = $el.data('section');
        show = !$el.hasClass('selected');
        $el.toggleClass('selected');
        Housing.RentalAgreement.show_optional_clause(section_id, show);
        return false;
      };

      FormView.prototype.update_sdr = function(data) {
        this.$el.find('.sdr-loading').hide();
        return this.$el.find('.fees .info').html(this.template.sdr({
          sdr_values: Housing.RentalAgreement.sdr_values
        }));
      };

      FormView.prototype.force_update_answer = function(question_id, answer, diff_id) {
        var $question_inputs, selector;
        selector = '';
        if (diff_id) {
          selector = '.section-wrap[data-diff-id="' + diff_id + '"]';
        }
        selector += '.question-container[data-ques-id="' + question_id + '"] .input';
        $question_inputs = this.$el.find(selector);
        if ($question_inputs.length === 1) {
          return $question_inputs.val(answer);
        } else if ($question_inputs.length > 1) {
          return $question_inputs.filter('[value="' + answer + '"]').prop('checked', true);
        }
      };

      FormView.prototype.load_sdr = function(data) {
        return this.$el.find('.sdr-loading').show();
      };

      FormView.prototype.destroy = function() {
        this.destroyed = true;
        if (this.smarty) {
          this.smarty.smarty('bye');
        }
        if (this.keyspy) {
          this.keyspy.bye();
        }
        return this.stopListening();
      };

      return FormView;

    })(Backbone.View);
  });

}).call(this);

(function() {
  if (window.JST == null) {
    window.JST = {};
  }

  window.JST['rental_agreements/sidebar'] = function(context) {
    return (function() {
      var $c, $e, $o, diff_id, i, j, k, len, len1, len2, ref, ref1, ref2, section, step;
      $e = window.HAML.escape;
      $c = window.HAML.cleanValue;
      $o = [];
      $o.push("<div class='ra-sidebar-inner'>\n<div class='side-fixed'>\n<div class='side-agreement-title'>");
      if (this.title) {
        $o.push("" + $e($c(this.title)));
      } else {
        $o.push("Rental Agreement");
      }
      $o.push("</div>\n<div class='side-agreement-status'>\&nbsp;</div>\n</div>\n<div class='side-float'>");
      ref = this.steps;
      for (i = 0, len = ref.length; i < len; i++) {
        step = ref[i];
        $o.push("<div class='step' data-step='" + ($e($c(step.id))) + "'>\n<div class='" + (['step-info', "" + ($e($c(step.num === step.denom ? 'whatever' : void 0)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "'>\n<div class='icon-arrow-right step-arrow'></div>\n<div class='step-title'>" + ($e($c(step.name))) + "</div>\n<div class='step-progress-bar'>\n<div class='" + (['step-progress', "" + ($e($c(step.num === step.denom ? 'complete' : void 0)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "' style='width:" + ($e($c(48 * step.num / step.denom))) + "px;'></div>\n</div>\n</div>\n<div class='sections'>");
        ref1 = step.agreement_step_sections;
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          section = ref1[j];
          if (section.is_repeatable) {
            ref2 = section.diffs;
            for (k = 0, len2 = ref2.length; k < len2; k++) {
              diff_id = ref2[k];
              $o.push("" + $c(this.render('rental_agreements/sidebar_section', {
                section: section,
                diff_id: diff_id
              })));
            }
          } else {
            $o.push("" + $c(this.render('rental_agreements/sidebar_section', {
              section: section
            })));
          }
        }
        $o.push("</div>\n</div>");
      }
      $o.push("</div>\n<div class='side-bottom'>\n<div class='steps-to-go'>");
      switch (this.incomplete_sections) {
        case 0:
          $o.push("Completed!");
          break;
        case 1:
          $o.push("1 Step to Review Agreement");
          break;
        default:
          $o.push(this.incomplete_sections + " Steps to Review Agreement");
      }
      $o.push("</div>\n</div>\n</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(window.HAML.context(context));
  };

}).call(this);

define("backbone/templates/rental_agreements/_sidebar", function(){});

(function() {
  if (window.JST == null) {
    window.JST = {};
  }

  window.JST['rental_agreements/sidebar_section'] = function(context) {
    return (function() {
      var $c, $e, $o, section_class, title;
      $e = window.HAML.escape;
      $c = window.HAML.cleanValue;
      $o = [];
      section_class = '';
      if (this.section.is_optional) {
        section_class = 'optional';
      }
      if ((this.section.is_repeatable && this.section.num_diff[this.diff_id] === this.section.basic_denom + this.section.cond_decom_diff[this.diff_id]) || (!this.section.is_repeatable && this.section.num === this.section.basic_denom + this.section.cond_decom)) {
        section_class += ' complete';
      } else {
        section_class += ' incomplete';
      }
      if ((this.section.is_repeatable && this.section.num_diff[this.diff_id]) || (!this.section.is_repeatable && this.section.num)) {
        section_class += ' touched';
      }
      $o.push("<div class='" + (['section', "" + ($e($c(section_class)))].sort().join(' ').replace(/^\s+|\s+$/g, '')) + "' data-section='" + ($e($c(this.section.id))) + "' data-diff='" + ($e($c(this.diff_id))) + "'>");
      title = '';
      if (this.section.is_repeatable && this.section.agreement_step_section_questions.length) {
        title = this.section.agreement_step_section_questions[0].answer_diff[this.diff_id];
      }
      $o.push("<div class='section-title'>" + ($e($c(title || this.section.name))) + "</div>\n<div class='complete icon-tick-circle section-status'></div>\n<div class='icon-exclamation-circle incomplete section-status'></div>\n<div class='icon-circle section-status untouched'></div>\n</div>");
      return $o.join("\n").replace(/\s([\w-]+)='true'/mg, ' $1').replace(/\s([\w-]+)='false'/mg, '').replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(window.HAML.context(context));
  };

}).call(this);

define("backbone/templates/rental_agreements/_sidebar_section", function(){});

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define('backbone/views/rental_agreements/sidebar_view',['backbone/assets', 'backbone/templates/rental_agreements/_sidebar', 'backbone/templates/rental_agreements/_sidebar_section'], function(Housing) {
    var SideBarView;
    return SideBarView = (function(superClass) {
      extend(SideBarView, superClass);

      function SideBarView() {
        this.destroy = bind(this.destroy, this);
        this.answer_save_fail = bind(this.answer_save_fail, this);
        this.answer_save_sucess = bind(this.answer_save_sucess, this);
        this.saving_answers = bind(this.saving_answers, this);
        this.show_optional_clause = bind(this.show_optional_clause, this);
        this.delete_repeatable = bind(this.delete_repeatable, this);
        this.create_new_repeatable = bind(this.create_new_repeatable, this);
        this.update_repeatable_title = bind(this.update_repeatable_title, this);
        this.section_update_progress = bind(this.section_update_progress, this);
        this.step_update_progress = bind(this.step_update_progress, this);
        this.section_change = bind(this.section_change, this);
        this.touch_last_section = bind(this.touch_last_section, this);
        this.get_section_elem = bind(this.get_section_elem, this);
        this.section_click = bind(this.section_click, this);
        this.step_change = bind(this.step_change, this);
        this.step_click = bind(this.step_click, this);
        this.float_side = bind(this.float_side, this);
        this.render = bind(this.render, this);
        this.initialize = bind(this.initialize, this);
        return SideBarView.__super__.constructor.apply(this, arguments);
      }

      SideBarView.prototype.el = '#ra-sidebar';

      SideBarView.prototype.template = {
        main: window.JST['rental_agreements/sidebar'],
        section: window.JST['rental_agreements/sidebar_section']
      };

      SideBarView.prototype.events = {
        'click .step:not(.open)': 'step_click',
        'click .section:not(.active)': 'section_click'
      };

      SideBarView.prototype.last_step = null;

      SideBarView.prototype.last_section = null;

      SideBarView.prototype.last_diff = null;

      SideBarView.prototype.initialize = function(options) {
        this.options = options || {};
        if (!Housing.RentalAgreement) {
          return;
        }
        this.render();
        this.$side_float = this.$el.find('.side-float');
        this.side_float_el = this.$side_float.get(0);
        this.float_boundary_top = $('#header').outerHeight() + this.$el.find('.side-fixed').outerHeight();
        return this.float_boundary_bottom = this.$el.find('.side-bottom').outerHeight();
      };

      SideBarView.prototype.render = function() {
        return this.$el.html(this.template.main({
          steps: Housing.RentalAgreement.sorted_steps,
          incomplete_sections: Housing.RentalAgreement.incomplete_steps.length
        }));
      };

      SideBarView.prototype.float_side = function(e, scrollTop) {
        var downgoing, rect, veiled;
        if (innerHeight > $(document).height() - scrollTop || scrollTop < 0) {
          return;
        }
        downgoing = this.oldScrollTop > scrollTop;
        rect = this.side_float_el.getBoundingClientRect();
        veiled = downgoing ? rect.top < this.float_boundary_top : rect.bottom > innerHeight - this.float_boundary_bottom;
        veiled && this.$side_float.css({
          top: Math.min(0, Math.max(innerHeight - this.float_boundary_top - this.float_boundary_bottom - rect.height, rect.top - this.float_boundary_top + this.oldScrollTop - scrollTop))
        });
        return this.oldScrollTop = scrollTop;
      };

      SideBarView.prototype.step_click = function(e) {
        var step;
        step = $(e.currentTarget).data('step');
        if (!step) {
          return;
        }
        return Housing.RentalAgreement.step_change(step, 'side');
      };

      SideBarView.prototype.step_change = function(step) {
        if (!step) {
          return;
        }
        this.$el.find('.step').removeClass('active open');
        this.$el.find('.section').removeClass('active');
        this.$el.find('.step[data-step="' + step + '"]').addClass('active open');
        this.last_step = step;
        return this.touch_last_section();
      };

      SideBarView.prototype.section_click = function(e) {
        var diff_id, section_id;
        section_id = $(e.currentTarget).data('section');
        if (!section_id) {
          return;
        }
        diff_id = $(e.currentTarget).data('diff');
        if (!diff_id) {
          diff_id = null;
        }
        return Housing.RentalAgreement.section_change(section_id, diff_id, 'side');
      };

      SideBarView.prototype.get_section_elem = function(section_id, diff_id) {
        if (diff_id) {
          return this.$el.find('.section[data-section="' + section_id + '"][data-diff="' + diff_id + '"]');
        } else {
          return this.$el.find('.section[data-section="' + section_id + '"]');
        }
      };

      SideBarView.prototype.touch_last_section = function() {
        return this.get_section_elem(this.last_section, this.last_diff).addClass('touched');
      };

      SideBarView.prototype.section_change = function(section_id, diff_id) {
        if (!section_id) {
          return;
        }
        this.$el.find('.step, .section').removeClass('active');
        if (this.last_section !== section_id && parseInt(diff_id) !== parseInt(this.last_diff)) {
          this.touch_last_section();
        }
        this.get_section_elem(section_id, diff_id).addClass('active');
        this.last_section = section_id;
        return this.last_diff = diff_id;
      };

      SideBarView.prototype.step_update_progress = function(step_id, num, denom) {
        var steps_remaining, steps_remaining_text;
        this.$el.find('.step[data-step="' + step_id + '"] .step-progress')[num === denom ? 'addClass' : 'removeClass']('complete').css('width', Math.min(48, 48 * num / denom) + 'px');
        steps_remaining = Housing.RentalAgreement.incomplete_steps.length;
        if (steps_remaining === 0) {
          steps_remaining_text = 'Completed!';
        } else if (steps_remaining === 1) {
          steps_remaining_text = steps_remaining + ' Step to Review Agreement';
        } else {
          steps_remaining_text = steps_remaining + ' Steps to Review Agreement';
        }
        return this.$el.find('.steps-to-go').html(steps_remaining_text);
      };

      SideBarView.prototype.section_update_progress = function(section_id, diff_id, num, denom) {
        var $section;
        if (diff_id) {
          $section = this.$el.find('.section[data-section="' + section_id + '"][data-diff="' + diff_id + '"]');
        } else {
          $section = this.$el.find('.section[data-section="' + section_id + '"]');
        }
        if (num === denom) {
          return $section.removeClass('incomplete').addClass('complete');
        } else {
          return $section.addClass('incomplete').removeClass('complete');
        }
      };

      SideBarView.prototype.update_repeatable_title = function(step_id, section_id) {
        var section, title_answer;
        section = Housing.RentalAgreement.get_section_details(section_id);
        if (!section) {
          return;
        }
        title_answer = section.agreement_step_section_questions[0].answer_diff;
        return this.$el.find('.step[data-step="' + step_id + '"] .section[data-section="' + section_id + '"]').each(function(i, el) {
          var $el, diff_id, title;
          $el = $(el);
          diff_id = $el.data('diff');
          title = title_answer[diff_id] || (section.name + ' ' + (i + 1));
          return $el.find('.section-title').text(title);
        });
      };

      SideBarView.prototype.create_new_repeatable = function(section_id, diff_id) {
        var section;
        section = Housing.RentalAgreement.get_section_details(section_id);
        if (!section) {
          return;
        }
        return this.$el.find('.step[data-step="' + section.step_id + '"] .section:last-child').before(this.template.section({
          section: section,
          diff_id: diff_id
        }));
      };

      SideBarView.prototype.delete_repeatable = function(section_id, diff_id) {
        return this.$el.find('.section[data-section="' + section_id + '"][data-diff="' + diff_id + '"]').remove();
      };

      SideBarView.prototype.show_optional_clause = function(section_id, show) {
        return this.$el.find('.section[data-section="' + section_id + '"]')[show ? 'addClass' : 'removeClass']('shown');
      };

      SideBarView.prototype.saving_answers = function() {
        return $('.side-agreement-status').text('Saving...');
      };

      SideBarView.prototype.answer_save_sucess = function() {
        var status_field;
        status_field = $('.side-agreement-status');
        status_field.text('Saved');
        return setTimeout(function() {
          status_field.text('');
          return status_field = null;
        }, 3000);
      };

      SideBarView.prototype.answer_save_fail = function() {
        return $('.side-agreement-status').text('Save Failed');
      };

      SideBarView.prototype.destroy = function() {
        this.stopListening();
        return this.$el.off().remove();
      };

      return SideBarView;

    })(Backbone.View);
  });

}).call(this);

(function() {


  define('backbone/helpers/rental_agreements/fees_utils',[], function() {
    var FeesUtils;
    FeesUtils = {
      eval_condition: function(condition, condition_vars) {
        var operands, operator;
        operator = Object.keys(condition)[0];
        operands = condition[operator];
        switch (operator) {
          case "constant":
            return operands;
          case "variable":
            return condition_vars[operands];
          case "bool":
            return operands;
          case "&&":
            return this.eval_condition(operands[0], condition_vars) && this.eval_condition(operands[1], condition_vars);
          case "||":
            return this.eval_condition(operands[0], condition_vars) || this.eval_condition(operands[1], condition_vars);
          case "<=":
            return this.eval_condition(operands[0], condition_vars) <= this.eval_condition(operands[1], condition_vars);
          case ">=":
            return this.eval_condition(operands[0], condition_vars) >= this.eval_condition(operands[1], condition_vars);
          case "<":
            return this.eval_condition(operands[0], condition_vars) < this.eval_condition(operands[1], condition_vars);
          case ">":
            return this.eval_condition(operands[0], condition_vars) > this.eval_condition(operands[1], condition_vars);
          case "==":
            return this.eval_condition(operands[0], condition_vars) === this.eval_condition(operands[1], condition_vars);
          case "!=":
            return this.eval_condition(operands[0], condition_vars) !== this.eval_condition(operands[1], condition_vars);
          case "!":
            return !this.eval_condition(operands[0], condition_vars);
        }
      },
      eval_formula: function(formula, fees_vars) {
        var operand, operator, temp, temp_modulo_100;
        operator = Object.keys(formula)[0];
        operand = formula[operator];
        switch (operator) {
          case "constant":
            return operand;
          case "variable":
            return fees_vars[operand];
          case "+":
            return this.eval_formula(operand[0], fees_vars) + this.eval_formula(operand[1], fees_vars);
          case "-":
            return this.eval_formula(operand[0], fees_vars) - this.eval_formula(operand[1], fees_vars);
          case "*":
            return this.eval_formula(operand[0], fees_vars) * this.eval_formula(operand[1], fees_vars);
          case "/":
            return this.eval_formula(operand[0], fees_vars) / this.eval_formula(operand[1], fees_vars);
          case "**":
            return Math.pow(this.eval_formula(operand[0], fees_vars), this.eval_formula(operand[1], fees_vars));
          case "%":
            return this.eval_formula(operand[0], fees_vars) % this.eval_formula(operand[1], fees_vars);
          case "max":
            return Math.max(this.eval_formula(operand[0], fees_vars), this.eval_formula(operand[1], fees_vars));
          case "min":
            return Math.min(this.eval_formula(operand[0], fees_vars), this.eval_formula(operand[1], fees_vars));
          case "to_i":
            return parseInt(this.eval_formula(operand[0], fees_vars));
          case "to_f":
            return parseFloat(this.eval_formula(operand[0], fees_vars));
          case "ceil":
            return Math.ceil(this.eval_formula(operand[0], fees_vars));
          case "floor":
            return Math.floor(this.eval_formula(operand[0], fees_vars));
          case "round":
            return Math.round(this.eval_formula(operand[0], fees_vars));
          case "round_100":
            temp = Math.round(this.eval_formula(operand[0], fees_vars));
            temp_modulo_100 = temp % 100;
            return temp - temp_modulo_100 + (temp_modulo_100 < 50 ? 0 : 100);
        }
      },
      get_total_rent: function(monthly_rent, duration_months, increment_rate) {
        var i, months, ref, total_rent, year, years;
        years = parseInt(duration_months / 12);
        months = duration_months % 12;
        total_rent = 0;
        if (years > 0) {
          for (year = i = 1, ref = years; 1 <= ref ? i <= ref : i >= ref; year = 1 <= ref ? ++i : --i) {
            total_rent += monthly_rent * 12 * Math.pow(1 + increment_rate / 100, year - 1);
          }
        }
        return total_rent += monthly_rent * Math.pow(1 + increment_rate / 100, years) * months;
      }
    };
    return FeesUtils;
  });

}).call(this);

define('backbone/helpers/rental_agreements/bangalore_fees',[], function() {
return {
	"max_duration": 0,
	"fees_variables": {
		"Lease": {
			"mandatory": {
				"monthly_rent": null,
				"duration_months": 11
			},
			"optional": {
				"security_deposit": 0
			},
			"calculated": ["total_rent"]
		}
	},
	"fees_logic": {
		"Lease": {
			"stamp_duty": [{
				"condition": {
					"bool": true
				},
				"formula": {
					"ceil": [{
						"min": [{
							"constant": 500
						}, {
							"*": [{
								"constant": 0.005
							}, {
								"+": [{
									"variable": "total_rent"
								}, {
									"variable": "security_deposit"
								}]
							}]
						}]
					}]
				}
			}],
			"registration_fee": [],
			"convenience_fee": [{
				"condition": {
					"bool": true
				},
				"formula": {
					"constant": 250
				}
			}],
			"discount": [{
				"condition": {
					"bool": true
				},
				"formula": {
					"constant": -250
				}
			}]
		}
	},
	"fees_calculator_available": true,
	"fees_calculator_expandable": false,
	"fees_line_1": "Create online in minutes. Free home delivery.",
	"fees_line_2": "Estimated Stamp Duty for 11 month Lease",
	"fees_line_0": "Tip: Skip rental agreement hassles"
}
});

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define('backbone/models/rental_agreements/ra_fees_model',['backbone/assets', 'backbone/helpers/rental_agreements/fees_utils', 'backbone/helpers/rental_agreements/bangalore_fees'], function(Housing, RAFeesUtils, FeesData) {
    var FeesModel;
    FeesModel = (function(superClass) {
      extend(FeesModel, superClass);

      function FeesModel() {
        this.destroy = bind(this.destroy, this);
        this.silent_set = bind(this.silent_set, this);
        this.update_fees = bind(this.update_fees, this);
        this.on_data_fetched = bind(this.on_data_fetched, this);
        this.fetch_data = bind(this.fetch_data, this);
        return FeesModel.__super__.constructor.apply(this, arguments);
      }

      FeesModel.prototype.initialize = function(options) {
        var city_id;
        if (!options) {
          return;
        }
        this.options = options;
        if (options.city_id != null) {
          city_id = options.city_id;
        }
        setTimeout(this.fetch_data, 0);
        return this.on('change', this.update_fees);
      };

      FeesModel.prototype.fetch_data = function() {
        return this.on_data_fetched(FeesData);
      };

      FeesModel.prototype.on_data_fetched = function(data) {
        if (!data.fees_logic || _.isEqual({}, data.fees_logic)) {
          return;
        }
        this.fees_logic = data.fees_logic;
        this.fees_variables = data.fees_variables;
        this.update_constants(data);
        this.update_vars();
        this.compute_fees();
        return this.trigger('model:init:done');
      };

      FeesModel.prototype.update_constants = function(data) {
        return this.silent_set({
          max_duration: data.max_duration,
          fees_line_0: data.fees_line_0,
          fees_line_1: data.fees_line_1,
          fees_line_2: data.fees_line_2,
          fees_calculator_expandable: data.fees_calculator_expandable,
          fees_calculator_available: data.fees_calculator_available,
          ra_type: Object.keys(this.fees_logic)[0]
        });
      };

      FeesModel.prototype.sanitized_set = function(params) {
        var key, value;
        for (key in params) {
          value = params[key];
          if (isNaN(value) && this.get('optional').indexOf(key) !== -1) {
            params[key] = this.fees_variables[this.get('ra_type')].optional[key];
          }
        }
        return this.set(params);
      };

      FeesModel.prototype.update_total_rent = function() {
        var duration_months, increment_rate, monthly_rent;
        duration_months = this.get('duration_months');
        monthly_rent = this.get('monthly_rent');
        increment_rate = this.get('increment_rate');
        return this.silent_set({
          total_rent: RAFeesUtils.get_total_rent(monthly_rent, duration_months, increment_rate)
        });
      };

      FeesModel.prototype.update_vars = function() {
        var curr_vars;
        curr_vars = this.fees_variables[this.get('ra_type')];
        this.silent_set({
          mandatory: Object.keys(curr_vars.mandatory),
          optional: Object.keys(curr_vars.optional)
        });
        this.silent_set(_.extend({}, curr_vars.mandatory, curr_vars.optional));
        return this.sanitized_set(this.options);
      };

      FeesModel.prototype.compute_fees = function() {
        var compute_logic, computed_components, fee_component, i, len, obj, ref, total_fees;
        this.update_total_rent();
        if (this.fees_logic) {
          compute_logic = this.fees_logic[this.get('ra_type')];
        }
        computed_components = {};
        for (fee_component in compute_logic) {
          ref = compute_logic[fee_component];
          for (i = 0, len = ref.length; i < len; i++) {
            obj = ref[i];
            if (RAFeesUtils.eval_condition(obj.condition, this.toJSON())) {
              computed_components[fee_component] = RAFeesUtils.eval_formula(obj.formula, this.toJSON());
              break;
            }
          }
        }
        this.silent_set(computed_components);
        total_fees = this.get('stamp_duty') + this.get('registration_fee') + this.get('convenience_fee') + this.get('discount');
        this.silent_set({
          total_fees: total_fees
        });
        return hnow('fees_model', this.toJSON());
      };

      FeesModel.prototype.update_fees = function() {
        this.compute_fees();
        return this.trigger('fees:update:done');
      };

      FeesModel.prototype.silent_set = function(attr) {
        if (attr && typeof attr === 'object') {
          return this.set(attr, {
            silent: true
          });
        }
      };

      FeesModel.prototype.reset = function() {
        this.abort_xhr();
        this.fees_variables = null;
        return this.fees_logic = null;
      };

      FeesModel.prototype.abort_xhr = function() {
        if (this.fees_data_req) {
          this.fees_data_req.abort();
          return this.fees_data_req = null;
        }
      };

      FeesModel.prototype.destroy = function() {
        this.abort_xhr();
        return this.off();
      };

      return FeesModel;

    })(Backbone.Model);
    return FeesModel;
  });

}).call(this);

define('backbone/helpers/rental_agreements/bangalore',[], function() {
return {
	"message": "Success",
	"data": {
		"client_uuid": "d27ffc66-39ea-41e3-a7f7-08e89b5c5528",
		"uid": "41122e2f-12b5-4899-a4d3-6e8c0f374369",
		"email": "",
		"status_id": 1,
		"url": null,
		"agreement_id": 7,
		"city_id": 38,
		"invoice_url": null,
		"name": "Rental Agreement 4",
		"user_name": "Aziz Khambati",
		"last_step_id": 17,
		"last_section_id": 45,
		"last_question_id": 163,
		"last_diff_id": 1,
		"fees": null,
		"user_type": "landlord",
		"user_type_extension": null,
		"incomplete_notification_sent": false,
		"old_id": null,
		"old_agreement": false,
		"code": "RA-BAN-0000043784",
		"placed_order_id": null,
		"status_name": "INCOMPLETE",
		"city_name": "Bengaluru",
		"city_max_duration": 0,
		"agreement_city": {
			"is_full_page": true,
			"thumb_available": false,
			"e_registration_available": false
		},
		"agreement": {
			"id": 7,
			"agreement_type_id": 1,
			"mode": "",
			"template_id": 4,
			"agreement_type_name": "Lease",
			"template_content": "\u003ch2\u003eLease Agreement\u003c/h2\u003e\n\u003cp\u003eThis Lease Agreement (\u0026quot;Agreement\u0026quot;) is executed at \u003cspan class=\"ans-field\" data-ssq=\"181\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"185\" data-cond=\"!=\"\u003e\u003cspan class=\"ans-field\" data-ssq=\"185\"\u003e\u003cspan class=\"ans-before\"\u003eon the \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e\u003c/span\u003e between;\u003c/p\u003e\n\u003cdiv class=\"rep-block\" data-ss=\"45\"\u003e\n\u003cp\u003e\u003cspan class=\"ans-field\" data-ssq=\"163\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e,\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"164\"\u003e\u003cspan class=\"ans-before\"\u003ePAN \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e,\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"165\"\u003e\u003cspan class=\"ans-before\"\u003ehaving permanent address at \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"166\" data-cond=\"==Yes\"\u003e\n\u003cspan class=\"ans-field\" data-ssq=\"167\"\u003e\u003cspan class=\"ans-before\"\u003ethrough his/her Power Of Attorney named \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e,\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"168\"\u003e\u003cspan class=\"ans-before\"\u003ehaving permanent address at \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e\n\u003c/span\u003e\u003c/p\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"rep-45\" data-cond=\"==1\"\u003e\n\u003cp\u003ehereinafter called the \u0026quot;Lessor\u0026quot; (which expression shall, unless it be repugnant to the context or meaning thereof be deemed to mean and include his/her heir, successor and assigns) of the FIRST PART.\u003c/p\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"rep-45\" data-cond=\"!=1\"\u003e\n\u003cp\u003ehereinafter are collectively and individually called the \u0026quot;Lessor\u0026quot; (which expression shall, unless it be repugnant to the context or meaning thereof be deemed to mean and include their heirs, successors and assigns) of the FIRST PART.\u003c/p\u003e\n\u003c/div\u003e\n\u003ch3\u003eAND\u003c/h3\u003e\n\u003cdiv class=\"rep-block\" data-ss=\"47\"\u003e\n\u003cp\u003e\u003cspan class=\"ans-field\" data-ssq=\"170\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e,\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"171\"\u003e\u003cspan class=\"ans-before\"\u003ePAN \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e,\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"172\"\u003e\u003cspan class=\"ans-before\"\u003ehaving permanent address at \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e\u003c/p\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"rep-47\" data-cond=\"==1\"\u003e\n\u003cp\u003ehereinafter called the \u0026quot;Lessee\u0026quot; (which expression shall, unless it be repugnant to the context or meaning thereof be deemed to mean and include his/her heir, successor and assigns) of the SECOND PART.\u003c/p\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"rep-47\" data-cond=\"!=1\"\u003e\n\u003cp\u003ehereinafter are collectively and individually called the \u0026quot;Lessee\u0026quot; (which expression shall, unless it be repugnant to the context or meaning thereof be deemed to mean and include their heirs, successors and assigns) of the SECOND PART.\u003c/p\u003e\n\u003c/div\u003e\n\u003cbr\u003e\n\u003cp\u003e(Each of the Lessor and Lessee are hereinafter individually referred to as a \u0026quot;Party\u0026quot; and collectively referred to as \u0026quot;Parties\u0026quot;.)\u003c/p\u003e\n\u003cbr\u003e\n\u003cp\u003e\u003cspan class=\"ans-field\" data-ssq=\"174\"\u003e\u003cspan class=\"ans-before\"\u003eWHEREAS the Lessor has represented to the Lessee that he/she is the sole and absolute lawful owner of a residential \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"175\"\u003e\u003cspan class=\"ans-before\"\u003eadmeasuring \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e sq.ft. (built up approximately)\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"176\"\u003e\u003cspan class=\"ans-before\"\u003ecomprising of \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e bedroom(s)\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"177\"\u003e\u003cspan class=\"ans-before\"\u003eand \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e bathroom(s)\u003c/span\u003e\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"174\" data-cond=\"==Independent House\"\u003e\n\u003cspan class=\"ans-field\" data-ssq=\"183\"\u003e\u003cspan class=\"ans-before\"\u003eknown as \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e\n\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"174\" data-cond=\"==Apartment\"\u003e\n\u003cspan class=\"ans-field\" data-ssq=\"178\"\u003e\u003cspan class=\"ans-before\"\u003ewith the flat number \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"179\"\u003e\u003cspan class=\"ans-before\"\u003eon the \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e floor\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"184\"\u003e\u003cspan class=\"ans-before\"\u003eof the building known as \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e\n\u003c/span\u003e\n\u003cspan class=\"ans-field\" data-ssq=\"180\"\u003e\u003cspan class=\"ans-before\"\u003esituated at \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e,\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"181\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"182\"\u003e\u003cspan class=\"ans-before\"\u003e- \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e, \u003c/span\u003e\u003c/span\u003e\u003cspan class=\"cond cond-inline\" data-mstr=\"197\" data-cond=\"!=Yes\"\u003e\n(hereinafter the said premises is referred to as the \u0026quot;Leased Premises\u0026quot;); and that the said premises was purchased by him/her under an Agreement upon compliance of the terms and conditions of the said Agreement and the Lessor was put in possession of the said Leased premises.)\u003c/span\u003e\u003cspan class=\"cond cond-inline\" data-mstr=\"197\" data-cond=\"==Yes\"\u003e\n\u003cspan class=\"ans-field\" data-ssq=\"198\"\u003e\u003cspan class=\"ans-before\"\u003eand \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e parking space(s);\u003c/span\u003e\u003c/span\u003e (hereinafter the said premises and parking space(s) are together referred to as the \u0026quot;Leased Premises\u0026quot;); and that the said premises was purchased by him/her under an Agreement upon compliance of the terms and conditions of the said Agreement and the Lessor was put in possession of the said Leased premises.)\n\u003c/span\u003e\u003c/p\u003e\n\u003cbr\u003e\n\u003cp\u003eNOW THEREFORE THIS AGREEMENT WITNESS AND IT IS HEREBY AGREED BY AND BETWEEN THE PARTIES HERETO AS FOLLOWS:\u003c/p\u003e\n\u003cbr\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003e\n\u003cp\u003eSCOPE \u0026amp; PURPOSE:\u003c/p\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor does hereby grant and deliver by way of Lease to the Lessee and the Lessee takes on Lease from the Lessor, the Leased Premises.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee shall use the Leased Premises for residential purpose only for himself/herself, bonafide guests, family members and domestic servants and for no other purpose.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor shall provide to the Lessee the benefit of all fittings and furniture \u003cspan class=\"cond cond-inline\" data-mstr=\"237\" data-cond=\"==Yes\"\u003eas specified in the Annexure 1\u003c/span\u003e, amenities and conveniences installed in respect of, or in addition to the Leased Premises.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee and his/her visitors have the right to use the doorways, entrance halls, staircases, elevators, landings, lobbies and passages in the building, and the compound of the building leading to the Leased Premises, for ingress thereto and egress therefrom.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem pri\"\u003e\n\u003cp\u003ePERIOD:\u003c/p\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor hereby agrees to grant to the Lessee on Lease basis, mere temporary residential use and occupation of the Leased Premises for a term of \u003cspan class=\"ans-field\" data-ssq=\"186\"\u003e\u003cspan class=\"ans-before\"\u003e \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e months\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"187\"\u003e\u003cspan class=\"ans-before\"\u003ewith effect from \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e (\u0026quot;Lease Commencement Date\u0026quot;)\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"EndDate\"\u003e\u003cspan class=\"ans-before\"\u003eto \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e (the \u0026quot;Tenure\u0026quot;)\u003c/span\u003e\u003c/span\u003e unless terminated earlier by either Party as set out in this Agreement.\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"188\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"2\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThis Agreement can be terminated by either Party by giving a written notice of \u003cspan class=\"ans-field\" data-ssq=\"282\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e days in advance without assigning any reason (hereinafter referred to as the ‘Notice Period’).\u003c/span\u003e\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"201\" data-cond=\"==No\"\u003e\n\u003cdiv start=\"3\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThere is no Lock in period.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"201\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"3\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003e\u003cspan class=\"ans-field\" data-ssq=\"202\"\u003e\u003cspan class=\"ans-before\"\u003eNeither Party may terminate the Agreement before the expiry of \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e month(s) from the Lease Commencement Date of this Deed (\u0026quot;Lock in Period\u0026quot;).\u003c/span\u003e\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"188\" data-cond=\"!=Yes\"\u003e\nNotwithstanding the same, The Lock in Period is of \u003cspan class=\"ans-field\" data-ssq=\"202\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e month(s)\u003c/span\u003e\u003c/span\u003e from either parties.\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"188\" data-cond=\"==Yes\"\u003eNotwithstanding the same, The Lock in Period is of \u003cspan class=\"ans-field\" data-ssq=\"202\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e month(s)\u003c/span\u003e\u003c/span\u003e from either partiesand the notice referred to in Clause 2.2 above could be given anytime such that the Notice Period will thereafter expire on or after the conclusion of the Lock in period.\n\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"203\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"4\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIn case the Lessee vacates the Leased Premises before the Lock in period, he/she is subject to pay the Lease Fee for balance number of months of the Lock in period.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"203\" data-cond=\"==No\"\u003e\n\u003cdiv start=\"4\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIn case the Lessee vacates the Leased Premises before the Lock in period, he/she is not subject to pay the Lease Fee for balance number of months of the Lock in period.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" \u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem pri\"\u003e\n\u003cp\u003eLEASE FEE:\u003c/p\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eDuring the Tenure the Lessee agrees to pay Lease Fee amounting to \u003cspan class=\"ans-field\" data-ssq=\"190\"\u003e\u003cspan class=\"ans-before\"\u003eRs. \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e per month which is fixed for the use and occupation of the Leased Premises.\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"191\"\u003e\u003cspan class=\"ans-before\"\u003eThe Lease Fee for the month shall be payable to the Lessor in advance on or before \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e of every month for permission to use and occupy the Leased Premises for that month.\u003c/span\u003e\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"194\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"3\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eOn expiry of the Term, if the Parties agree to renew the Tenure,\n\u003cspan class=\"cond cond-inline\" data-mstr=\"195\" data-cond=\"!=\"\u003e\nthen such renewal shall be subject to a \u003cspan class=\"ans-field\" data-ssq=\"195\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e%\u003c/span\u003e\u003c/span\u003e increase in the Lease Fee and\n\u003c/span\u003ethe Tenure shall be renewable for such period and under such terms and conditions as may be mutually decided by the Parties\n\u003cspan class=\"cond cond-inline\" data-mstr=\"195\" data-cond=\"!=\"\u003e\nand a fresh agreement shall be executed.\n\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"194\" data-cond=\"==No\"\u003e\n\u003cdiv start=\"3\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eOn expiry of the Term, the Tenure shall not be renewed.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"192\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"4\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003eSECURITY DEPOSIT:\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee shall keep with the Lessor a sum of \u003cspan class=\"ans-field\" data-ssq=\"193\"\u003e\u003cspan class=\"ans-before\"\u003eRs. \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e as interest free refundable deposit during the period he/she continues to occupy the Leased Premises, for the use of the Leased Premises and amenities therein and for the due observance and performance of the terms and conditions of this agreement.\u003c/span\u003e\u003c/span\u003e\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Security Deposit will be returned once the Lessor is satisfied that the Leased Premises has been returned in the same condition that it was in when the Lessee was given possession of the Leased Premises. If any damages are incurred, or any outgoings, Lease Fee and charges towards utilities consumed in respect of the Leased Premises such as gas charge, water charge, electricity charge, telephone charge, internet connection charge, cable network consumed in the Leased Premises is outstanding and/or unpaid on the part of the Lessee, the same shall be adjusted by the Lessor against the Security Deposit on termination or expiry of this Agreement, whichever is earlier.\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"220\" data-cond=\"==Cheque\"\u003e\n\u003cdiv start=\"3\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003e\u003cspan class=\"ans-field\" data-ssq=\"193\"\u003e\u003cspan class=\"ans-before\"\u003eThe Lessee has, on or before the execution of this agreement, paid to the Lessor the deposit amount of Rs. \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e \u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"218\"\u003e\u003cspan class=\"ans-before\"\u003eunder bank cheque number \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"217\"\u003e\u003cspan class=\"ans-before\"\u003edated \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e drawn on the Lessee's banking account with\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"214\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e bank\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"ans-field\" data-ssq=\"215\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e branch, the receipt whereof, the Lessor hereby admits and acknowledges.\u003c/span\u003e\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"220\" data-cond=\"==Demand Draft\"\u003e\n\u003cdiv start=\"4\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee has, on or before the execution of this agreement, paid to the Lessor the deposit amount of \u003cspan class=\"ans-field\" data-ssq=\"193\"\u003e\u003cspan class=\"ans-before\"\u003eRs. \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e under demand draft no. \u003cspan class=\"ans-field\" data-ssq=\"74\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e dated \u003cspan class=\"ans-field\" data-ssq=\"217\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e drawn on the Lessee's banking account with \u003cspan class=\"ans-field\" data-ssq=\"214\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e branch \u003cspan class=\"ans-field\" data-ssq=\"215\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e, the receipt whereof, the Lessor hereby admits and acknowledges.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"220\" data-cond=\"==Net Banking\"\u003e\n\u003cdiv start=\"5\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee has, on or before the execution of this Agreement, paid to the Lessor the deposit amount of \u003cspan class=\"ans-field\" data-ssq=\"193\"\u003e\u003cspan class=\"ans-before\"\u003eRs. \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e under Transaction Reference No. \u003cspan class=\"ans-field\" data-ssq=\"216\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e dated \u003cspan class=\"ans-field\" data-ssq=\"217\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e drawn on the Lessee's banking account with \u003cspan class=\"ans-field\" data-ssq=\"214\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e branch \u003cspan class=\"ans-field\" data-ssq=\"215\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e, the receipt whereof, the Lessor hereby admits and acknowledges.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"220\" data-cond=\"==Cash\"\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe deposit amount \u003cspan class=\"ans-field\" data-ssq=\"193\"\u003e\u003cspan class=\"ans-before\"\u003eof Rs. \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e is paid in cash by the Lessee, the receipt whereof, the Lessor hereby admits and acknowledges.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"221\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"4\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIn case the Lessee is ready and willing to hand over the charge of the Leased Premises on the date of expiry or termination, but the Lessor is unable to repay the balance of the Security Deposit then the Lessee shall enjoy the Leased Premises till the date the Lessor returns the balance of the Security Deposit without any obligation to pay the Lease Fee.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"221\" data-cond=\"==No\"\u003e\n\u003cdiv start=\"5\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIn case the Lessee is ready and willing to hand over the charge of the Leased Premises on the date of expiry or termination, but the Lessor is unable to repay the balance of the Security Deposit then the Lessee shall not enjoy the Leased Premises till the date the Lessor returns the balance of the Security Deposit without any obligation to pay the Lease Fee.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"219\" data-cond=\"==Interest for the default days\"\u003e\n\u003cdiv start=\"5\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIn case the Lessee is ready and willing to hand over the charge of the Leased Premises on the date of expiry or termination, but the Lessor is unable to repay the balance of the Security Deposit then the Lessor shall be liable to pay to the Lessee interest at \u003cspan class=\"ans-field\" data-ssq=\"222\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e% per annum as penalty from the time the relevant amount becomes due to the Lessee till the date of actual return by the Lessor to the Lessee.\u003c/span\u003e\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"219\" data-cond=\"==Fixed amount per day\"\u003e\n\u003cdiv start=\"6\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIn case the Lessee is ready and willing to hand over the charge of the Leased Premises on the date of expiry or termination, but the Lessor is unable to repay the balance of the Security Deposit then the Lessor shall be liable to pay to the Lessee Rs. \u003cspan class=\"ans-field\" data-ssq=\"223\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e per day as penalty from the time the relevant amount becomes due to the Lessee till the date of actual return by the Lessor to the Lessee.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"219\" data-cond=\"==No penalty\"\u003e\n\u003cdiv start=\"7\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIn case the Lessee is ready and willing to hand over the charge of the Leased Premises on the date of expiry or termination, but the Lessor is unable to repay the balance of the Security Deposit then the Lessor shall not be liable to pay to the Lessee any penalty till the time he returns the security deposit.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"197\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"5\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003ePARKING:\n\u003cdiv start=\"6\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor is also the owner of \u003cspan class=\"ans-field\" data-ssq=\"198\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e parking space(s) which is a part of the Leased Premises. \u003cspan class=\"ans-field\" data-ssq=\"200\"\u003e\u003cspan class=\"ans-before\"\u003eThe parking number(s) is/are \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e.\u003c/span\u003e\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"199\" data-cond=\"!=0\"\u003e\nThe parking fee is \u003cspan class=\"ans-field\" data-ssq=\"199\"\u003e\u003cspan class=\"ans-before\"\u003eRs. \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e per month.\n\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"224\" data-cond=\"==Included in monthly rent\"\u003e\nThe parking fee is included in the monthly Lease Fee.\n\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"224\" data-cond=\"==Paid separately\"\u003e\nThe parking fee is paid separately to the Lessor every month at the same time as the Lease Fee is paid.\n\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"6\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003e\n\u003cp\u003eMAINTAINENCE:\u003c/p\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe society maintenance charges would be paid on actuals by the\n\u003cspan class=\"cond cond-inline\" data-mstr=\"205\" data-cond=\"==Landlord\"\u003e\nLessor.\n\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"205\" data-cond=\"==Tenant\"\u003e\nLessee.\n\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem pri\"\u003e\n\u003cp\u003eRIGHTS \u0026amp; OBLIGATIONS OF THE LESSEE:\u003c/p\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"204\" data-cond=\"==Yes\"\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eOUTGOING:\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eIn addition to the Lease Fee, the Lessee shall be liable to bear and pay every month all outgoings and charges on actuals, towards utilities consumed in respect of the Leased Premises such as gas charges, water charges, electricity charges, telephone, internet, cable charges.\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eDuring the Tenure if the Lessor has paid any/all outgoings and charges for the aforementioned utilities, the Lessee shall reimburse any/all such amounts to the Lessor from a demand made by the Lessor.\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee shall not be liable for outgoings of any kind whatsoever for the period prior to the Lease Commencement Date of this Agreement or after the delivery of possession thereof to the Lessor.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"2\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eDAMAGE:\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee shall not carry on any illegal or unlawful activities or cause any nuisance or annoyance or disturbance to the occupants of the building and neighborhood, and not store any combustible, inflammable, explosive or hazardous materials or any other dangerous things that may imperil the safety of the building or its occupants in the Leased Premises.\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee shall use the Leased Premises and all the amenities therein with due care and diligence.\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee shall not cause any damage to the Leased Premises (reasonable wear and tear accepted) or the surroundings therein and in such an eventuality, repair the same to the satisfaction of the Lessor.\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee shall keep and maintain the Leased Premises and fixtures provided in good order and condition and upon the termination or sooner determination of the agreement, the Lessee shall leave the same in as good a condition as they were in on the date hereof (reasonable wear and tear accepted).\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eIf any damages to the Leased Premises caused by the Lessee's use are noticed, the Lessee shall be responsible for the repair of the same or the cost of repairing the damages, if any, shall be paid by the Lessee.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eREPAIRS AND ALTERATIONS:\n\u003cdiv class=\"cond cond-block\" data-mstr=\"227\" data-cond=\"==Yes, without consent\"\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee can make alterations or additions to the Leased Premises of any nature whatsoever, structural or otherwise, without the prior consent of the Lessor.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"227\" data-cond=\"==Yes, with consent\"\u003e\n\u003cdiv start=\"3\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee can make alterations or additions to the Leased Premises of any nature whatsoever, structural or otherwise, with the prior consent of the Lessor.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"227\" data-cond=\"==No\"\u003e\n\u003cdiv start=\"3\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee cannot make any alterations or additions to the Leased Premises of any nature whatsoever, structural or otherwise.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"228\" data-cond=\"==Landlord(s)\"\u003e\n\u003cdiv start=\"4\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessor shall undertake and carry out at his/her own costs during the Agreement period, all internal (non-structural) repairs to the Leased Premises and repairs and replacements of fixtures, fittings and incidental thereto. Structural and major repairs would be carried out at the earliest by the Lessor at the Lessor's cost.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"228\" data-cond=\"==Landlord(s) and Tenant(s)\"\u003e\n\u003cdiv start=\"5\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee and Lessor, together shall undertake and carry out at their own costs during the Tenure, all internal (non-structural) repairs to the Leased Premises and repairs and replacements of fixtures, fittings and incidental thereto. Structural and major repairs would be carried out at the earliest by the Lessor at the Lessor's cost.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"228\" data-cond=\"==Tenant(s)\"\u003e\n\u003cdiv start=\"6\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee shall undertake and carry out at his/her own costs during the Tenure, all internal (non-structural) repairs to the Leased Premises and repairs and replacements of fixtures, fittings and incidental thereto. Structural and major repairs would be carried out at the earliest by the Lessor at the Lessor's cost.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"3\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee has satisfied himself/herself that all the furnishings, fixtures and water, sanitary and electrical installations and fittings, are in good working order and no mirrors and glass panes are broken or missing.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eSOCIETY BYLAWS:\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee agrees to duly observe and perform, abide by, and/or otherwise comply with all the enactments, rules, regulations and notifications issued by the government or any other applicable authority, in so far as and to the extent any such by-laws, enactment, Rules, Regulations that are required to be observed and performed by the Lessor as the owner of the Leased Premises and the Lessee as the occupant of the Leased Premises.\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee hereby declares and undertakes that he/she shall not disturb neighbours through loud voices and slamming of doors.\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee shall not sublease, sublet, assign or otherwise part with the possession of the Leased Premises or any part thereof to anyone else.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem pri\"\u003e\n\u003cp\u003eRIGHTS AND OBLIGATIONS OF THE LESSOR:\u003c/p\u003e\n\u003cdiv start=\"9\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor shall be allowed to enter and inspect the Leased Premises giving prior notice.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee shall permit the Lessor or his/her duly authorized agents etc. upon reasonable prior notice to enter the Leased Premises for the purpose of inspection and/or to carry out any structural or major repairs as and when necessary at a mutually agreed time.\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"192\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"11\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor shall also be solely liable to return the interest free Security Deposit to the Lessee on the expiry or sooner determination of the Lease according to the terms of this Agreement, whichever is earlier.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"12\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor shall ensure that the Lessee enjoys quiet and peaceful possession of the Leased Premises during the Tenure without disturbance in any manner whatsoever from the Lessor or any others representing the Lessor.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor shall ensure that the Leased Premises remain in good and habitable condition throughout the Tenure.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor hereby warrants that there are no lawsuits, actions or proceedings filed or pending in any court of law or before any judicial or quasi-judicial bodies/authorities which would affect the Leased Premises and/or which would affect the Lease granted herein.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor shall pay all property taxes and all other duties, cess, impositions etc, levied by the municipal authorities, society charges, non-occupancy charges and other similar government outgoings up-to the Lease Commencement Date and during the Tenure, within the prescribed time frame so as to not jeopardise the rights and interest of the Lessee conferred under this Agreement.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor represents to the Lessee that the Leased Premises is free from any encumbrance, charge, lien or third party claim except for this Lease granted to the Lessee. The Lessor has not granted any lease or tenancy or created any interest in any favour of any third party with regard to the Leased Premises.\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"229\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"17\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIn case the supply of water in the Leased Premises is erratic or irregular, the Lessee shall immediately inform the Lessor and the Lessor shall make provisions for adequate storage of water to ensure steady supply.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"230\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"18\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eDuring the Tenure if the Lessor sells the Leased Premises then the Lessor shall ensure that the Lessee’s right to use and occupy the Leased Premises during the Tenure remains valid and effective and the new owner is bound by the terms and conditions of this Agreement.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"192\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"19\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIn the event of the Lessee is lawfully dispossessed from the Leased Premises for any reason whatsoever, the Lessor shall return the Security Deposit without raising any objection whatsoever, on the date of dispossession of the Lessee and Lessee’s right, and Clause 4 would continue to apply in such cases.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem pri\"\u003e\n\u003cp\u003eINDEMNITY:\u003c/p\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee agrees to indemnify and keep indemnified the Lessor against all costs (including the costs of defending) any action, proceeding, lawsuit, etc. by virtue of any act or omission of the Lessee or persons claiming under him, in breach of any provisions of this agreement.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem pri\"\u003e\n\u003cp\u003eREPRESENTATION BY THE LESSOR:\u003c/p\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor states that he/she is the owner in exclusive possession of and otherwise entitled to the Leased Premises.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem pri\"\u003e\n\u003cp\u003eCONSEQUENCES OF BREACH:\u003c/p\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIn case of any failure of payment of the Lease Fee (or failure without any specific reason) by the Lessee by the \u003cspan class=\"ans-field\" data-ssq=\"191\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e of every month Lessor shall issue a notice to the Lessee to remedy the defect within the time specified in the notice.\u003c/span\u003e\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"235\" data-cond=\"!=Do not specify\"\u003e\n\u003cdiv start=\"2\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eUpon failure to remedy the defect within the specified time, the Lessee is liable to pay\n\u003cspan class=\"cond cond-inline\" data-mstr=\"235\" data-cond=\"==Fixed charge per late payment\"\u003e\na fixed amount of \u003cspan class=\"ans-field\" data-ssq=\"234\"\u003e\u003cspan class=\"ans-before\"\u003eRs. \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e per late payment.\u003c/span\u003e\u003c/span\u003e\n\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"235\" data-cond=\"==Interest for the default days\"\u003e\ninterest from the date of default till the date of actual payment at \u003cspan class=\"ans-field\" data-ssq=\"236\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e% per annum on the amount defaulted.\u003c/span\u003e\u003c/span\u003e\n\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"233\" data-cond=\"!=\"\u003e\n\u003cdiv start=\"5\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003e\u003cspan class=\"ans-field\" data-ssq=\"233\"\u003e\u003cspan class=\"ans-before\"\u003eIn case of failure of payment for \u003c/span\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e consecutive months, the contract immediately stands terminated notwithstanding the Lock in period.\u003c/span\u003e\u003c/span\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"192\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"4\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe amount due shall be adjusted from the security deposit kept with the Lessor. The Lessor shall, without prejudice to any other remedy under the law, also be entitled to forfeit the deposit and recover damages for any loss caused to him/her.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem pri\"\u003e\n\u003cp\u003eRESTRICTION ON LIABILITY:\u003c/p\u003e\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor shall not be responsible or liable for any theft, loss, damage, or destruction of any property belonging to the Lessee or the said nominated person lying in the Leased Premises nor for any bodily injury to any of the occupants of the Leased Premises from any cause whatsoever, including, but not limited to, any loss, damage, harm or injury, caused by fire, theft, rain, provided that the provisions of this clause shall not apply in the case of wilful negligence of the Lessor.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"13\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003eSOCIETY/GOVERNMENT:\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee shall follow the rules and regulations that may be prescribed by the authorities in matter of consumption of electricity and water and other rules and regulations prescribed by the Government or any other authorities.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee shall abide by all the rules, regulations and by-laws of the Society/Association (as the case may be).\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"14\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003eARBITRATION:\n\u003cdiv start=\"15\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIf any dispute arises amongst the parties hereto during the subsistence of this Agreement or thereafter, in connection with the validity, interpretation, implementation or alleged material breach of any provision of this Agreement or regarding a question, including the questions as to whether the termination of this Agreement has been legitimate, the Parties shall endeavour to settle such a dispute amicably.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eIn the case of failure by the parties to resolve the dispute in the manner set out above within 30 days from the date when the dispute arose, the dispute shall be referred to arbitration of a sole arbitrator to be mutually appointed by the parties or in case of disagreement, by the court in accordance with the provisions of the Arbitration and Conciliation Act, 1996. The place of the court of arbitration shall be \u003cspan class=\"ans-field\" data-ssq=\"181\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e. The arbitration proceeding shall be governed by the Arbitration and Conciliation Act, 1996 and shall be in the English language. The arbitrator/arbitral panel shall also decide on the costs of the arbitration proceedings.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe arbitrator’s/arbitral panel’s award shall be substantiated in writing and the Parties shall submit to the arbitrator’s/arbitral panel’s award which shall be enforceable in the court of law in \u003cspan class=\"ans-field\" data-ssq=\"181\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe provisions of this Clause shall survive termination of this Agreement.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"15\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003eJURISDICTION:\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Agreement shall be subject to the jurisdiction of the courts at \u003cspan class=\"ans-field\" data-ssq=\"181\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e only.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"16\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003eAGREEMENT:\n\u003cdiv start=\"17\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThis Agreement shall be executed in duplicate and the original shall be retained by the Lessor and duplicate by the Lessee.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"17\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003eDELIVERY OF NOTICES:\n\u003cdiv start=\"18\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eAny notice required or permitted to be given by either party to this agreement to the other party shall be deemed to have been validly given if it has been personally delivered or dispatched through Registered Post, under acknowledgement.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"279\" data-cond=\"!=Do not specify\"\u003e\n\u003cdiv start=\"18\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003eDOCUMENTATION:\n\u003cdiv start=\"19\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe documentation charges are to be borne by\n\u003cspan class=\"cond cond-inline\" data-mstr=\"279\" data-cond=\"==Landlord(s)\"\u003e\nthe Lessor.\n\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"279\" data-cond=\"==Tenant(s)\"\u003e\nthe Lessee.\n\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"279\" data-cond=\"==Landlord(s) and Tenant(s)\"\u003e\nboth, the Lessor and Lessee.\n\u003c/span\u003e\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eRegistration and Stamp duty charges, if any, shall be borne by \u003cspan class=\"cond cond-inline\" data-mstr=\"279\" data-cond=\"==Landlord(s)\"\u003e\nthe Lessor.\n\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"279\" data-cond=\"==Tenant(s)\"\u003e\nthe Lessee.\n\u003c/span\u003e\n\u003cspan class=\"cond cond-inline\" data-mstr=\"279\" data-cond=\"==Landlord(s) and Tenant(s)\"\u003e\nboth, the Lessor and Lessee.\n\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"276\" data-cond=\"==No\"\u003e\n\u003cdiv start=\"19\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003ePETS:\n\u003cdiv start=\"21\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee is not allowed to keep pets on the property.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"276\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"19\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003ePETS:\n\u003cdiv start=\"22\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessee shall be allowed to keep pets on the property.\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eIf permitted then the Lessee is expected to keep, raise, and maintain a reasonable number of domestic dogs, cats, fish, reptiles, small mammals, and/or birds (collectively and individually the ‘Pet’) on the Leased Premises in accordance with the law. The Lessee will assume full and exclusive responsibility for the animal(s), as outlined below\n\u003cdiv class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Pet shall not be permitted to damage the Leased Premises, including, but not limited to, urinating or defecating on the carpet/floor;\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eAny Pet waste on the grounds around the Leased Premises must be promptly disposed of;\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Pet shall not cause discomfort, harm, or nuisance to other residents. If the Pet injures other persons, the Lessee shall assume full responsibility and liability;\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"273\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"25\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Pet shall be allowed to access shared amenities such as the laundry room, pool, recreational facilities, or similar amenities as determined by the Lessor’s policies and the Lessee’s reasonable judgement;\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"273\" data-cond=\"==No\"\u003e\n\u003cdiv start=\"26\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Pet shall not be allowed to access shared amenities such as the laundry room, pool, recreational facilities, or similar amenities as determined by the Lessor’s policies and the Lessee’s reasonable judgement;\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"274\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"26\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eUpon move-out, the Lessee will reimburse the Lessor for the costs associated with protecting the health of the future Lessee, such as de-fleeing, deodorizing, and shampooing the Leased Premises; and\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"274\" data-cond=\"==No\"\u003e\n\u003cdiv start=\"27\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eUpon move-out, the Lessee will not reimburse the Lessor for the costs associated with protecting the health of the future Lessee, such as de-fleeing, deodorizing, and shampooing the Leased Premises; and\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"27\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessee must comply with all applicable laws and regulations.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor’s remedies for violation of the above terms shall be at the Lessor’s discretion, and may include any or all of the following:\n\u003cdiv start=\"29\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eFor violation of any of the above terms, upon written notice, the Lessee must permanently remove the Pet from the Leased Premises.\u003c/div\u003e\n\u003cdiv class=\"litem ter\"\u003eIf the Leased Premises is damaged by the Pet, the Lessee shall be fully and exclusively liable and shall pay for the cost of replacement or repairs to the damaged items. The Lessee will arrange and pay for the Pet to stay with a third party during the period of repair or replacement.\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"275\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"31\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eFor failure to provide the necessary care for the Pet, the Lessor may enter the Leased Premises on written notice to turn the Pet over to a humane society or local authority.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"32\" class=\"olist\"\u003e\n\u003cdiv class=\"litem ter\"\u003eThe Lessor shall not be held liable for any harm, sickness, loss, or death of the Pet unless it is due to the Lessor’s wilful negligence. In addition, the Lessee shall indemnify the Lessor for all expenses resulting from any legal proceedings initiated as a result of injuries or damages caused by the Pet.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"20\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003eHANDOVER AT END OF CONTRACT:\n\u003cdiv start=\"21\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eUpon the expiry/termination of this Agreement, the Lessee shall hand over quiet, peaceful and vacant possession of the Leased Premises in good condition to the Lessor.\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"388\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"22\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eUpon the expiry/termination of this Agreement, the Lessee shall repaint the property to the satisfaction of the Lessor before handing over the quiet, peaceful and vacant possession of the Leased Premises\n\u003cspan class=\"cond cond-inline\" data-mstr=\"389\" data-cond=\"!=\"\u003e\n, failing which the Lessee shall pay to the Lessor a penalty of Rs. \u003cspan class=\"ans-field\" data-ssq=\"389\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003cspan class=\"ans-after\"\u003e.\u003c/span\u003e\u003c/span\u003e \u003cspan class=\"cond cond-inline\" data-mstr=\"192\" data-cond=\"==Yes\"\u003eThe amount shall be adjusted from the Security Deposit kept with the Lessor.\u003c/span\u003e\n\u003c/span\u003e\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"22\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eThe Lessor shall on expiry or termination of this Agreement and on the Lessee handing over vacant possession of the Leased Premises, permit the Lessee to remove all furniture and appliances owned by the Lessee.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"231\" data-cond=\"==Yes\"\u003e\n\u003cdiv start=\"21\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003eFAILURE OF HANDOVER:\n\u003cdiv start=\"22\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIf the Lessor is ready and willing to return the security deposit and the Lessee still fails to hand over the possession of the Leased Premises, the Lessee shall pay to the Lessor in addition to the Lease Fee, a penalty of Rs. \u003cspan class=\"ans-field\" data-ssq=\"232\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e per day from the date on which the Lessee defaults in handing over the vacant charge of the Leased Premises. The Lessor shall also be entitled to stop the entry of the Lessee and all others in the Leased Premises, and for the period after the aforesaid date, the Lessee shall be deemed to be a trespasser in the Leased Premises.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cdiv start=\"22\" class=\"olist\"\u003e\n\u003cdiv class=\"litem pri\"\u003eFORCE MAJEURE:\n\u003cdiv start=\"23\" class=\"olist\"\u003e\n\u003cdiv class=\"litem sec\"\u003eIf the performance of either party, or any of its obligations under this agreement is prevented, restricted, delayed or interfered with, by reason of any one or more of the following events namely fire, explosion, accident, natural calamities, epidemics, terrorist attacks, act(s) of sabotage, war (whether declared or not), civil commotion, riots, military coup, or other violence, any change in law or regulation or any other action of any government, or any other act or condition whatsoever beyond the reasonable control of the party (each such event to be called a \u0026quot;Force Majeure\u0026quot; event), then the party shall be excused from such performance to the extent of such prevention, restriction, delay or interference; provided, however, that the party gives prompt notice of the Force Majeure event and provides a description to the other Party of such Force Majeure event in such notice, including a description, in reasonable detail, of the occurrence and cause of the Force Majeure event; and provided further that the party may, though not obligated, use reasonable efforts, (not involving substantial costs), to avoid or remove or correct such Force Majeure event(s) and shall continue performance hereunder whenever such Force Majeure event(s) is/are removed.\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cbr\u003e\n\u003cdiv class=\"new-page\"\u003e\u003c/div\u003e\n\u003cp\u003eIn witness thereof the Lessor and Lessee have hereunto subscribed their hands.\u003c/p\u003e\n\u003cbr\u003e\n\u003cp\u003eSigned, Sealed and Delivered by\u003c/p\u003e\n\u003cdiv class=\"rep-block\" data-ss=\"45\"\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"166\" data-cond=\"!=Yes\"\u003e\n\u003cbr\u003e\n\u003cp\u003eLessor\u003c/p\u003e\n\u003cbr\u003e\n\u003cbr\u003e\n\u003cbr\u003e\n\u003cp\u003e___________________________\u003cbr\u003e\n\u003cspan class=\"ans-field\" data-ssq=\"163\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e\u003c/p\u003e\n\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"166\" data-cond=\"==Yes\"\u003e\n\u003cbr\u003e\n\u003cp\u003eOn Behalf of the Lessor\u003c/p\u003e\n\u003cbr\u003e\n\u003cbr\u003e\n\u003cp\u003e___________________________\u003cbr\u003e\n\u003cspan class=\"ans-field\" data-ssq=\"167\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e\u003c/p\u003e\n\u003c/div\u003e\n\u003c/div\u003e\n\u003cbr\u003e\n\u003cdiv class=\"rep-block\" data-ss=\"47\"\u003e\n\u003cbr\u003e\n\u003cp\u003eLessee\u003c/p\u003e\n\u003cbr\u003e\n\u003cbr\u003e\n\u003cp\u003e___________________________\u003cbr\u003e\n\u003cspan class=\"ans-field\" data-ssq=\"170\"\u003e\u003cspan class=\"ans-blank\"\u003e\u003c/span\u003e\u003c/span\u003e\u003c/p\u003e\n\u003c/div\u003e\n\u003cbr\u003e\n\u003cp\u003eIn the presence of\u003c/p\u003e\n\u003cbr\u003e\n\u003cp\u003e1 )\u003cbr\u003e\n___________________________\u003c/p\u003e\n\u003cbr\u003e\n\u003cp\u003e2 )\u003cbr\u003e\n___________________________\u003c/p\u003e\n\u003cbr\u003e\n\u003cdiv class=\"new-page\"\u003e\u003c/div\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"237\" data-cond=\"==Yes\"\u003e\n\u003ch3\u003eAnnexure 1\u003c/h3\u003e\n\u003cp\u003eThe Leased Premises has the following fittings and furnishings:\u003c/p\u003e\n\u003cbr\u003e\n\u003ctable\u003e\n\u003ctr\u003e\n\u003ctd\u003eItem\u003c/td\u003e\n\u003ctd\u003eCount\u003c/td\u003e\n\u003c/tr\u003e\n\u003ctbody\u003e\u003c/tbody\u003e\n\u003c/table\u003e\n\u003cdiv class=\"cond cond-block\" data-mstr=\"w\" data-cond=\"\"\u003e\u003c/div\u003e\n\u003c/div\u003e\n",
			"agreement_steps": [{
				"id": 17,
				"order": 1,
				"name": "Landlord",
				"description": "Details about the owners of the property that is being rented out.",
				"image_url": null,
				"label": null,
				"agreement_step_sections": [{
					"id": 45,
					"order": 1,
					"name": "Landlord",
					"description": "",
					"is_repeatable": true,
					"is_optional": null,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 163,
						"order": 1,
						"tag": "share_ld_name",
						"name": "What is the landlord's name?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "E.g. John Doe",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "landlord_name",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "Please enter a valid name.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": []
					}, {
						"id": 165,
						"order": 3,
						"tag": "",
						"name": "What is their permanent address?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "party_address",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": []
					}, {
						"id": 164,
						"order": 4,
						"tag": "",
						"name": "What is their PAN? (optional)",
						"helper_text": "Please enter the 10 digit PAN number.",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "E.g. ABCDE1234F",
						"options": [],
						"regex": "^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$",
						"is_mandatory": false,
						"default_answer": "",
						"label": "party_pan",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "Uppercase",
						"sensitive": true,
						"logics": []
					}, {
						"id": 166,
						"order": 5,
						"tag": "",
						"name": "Has the landlord appointed a Power of Attorney?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "No",
						"label": "landlord_if_poa",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "A power of attorney is the legal authority given by one party to another to act on their behalf in their absence.",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 167,
						"order": 6,
						"tag": "share_poa_name",
						"name": "Who has the 'power of attorney' been appointed to?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "E.g. John Doe",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "landlord_poa_name",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "Please enter a valid name.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": [{
							"block_id": 167,
							"id": 102,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 166,
							"created_at": "2015-06-02T01:47:03.355+05:30",
							"updated_at": "2015-06-02T01:47:03.355+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 168,
						"order": 7,
						"tag": "",
						"name": "What is their permanent address?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "party_address",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": [{
							"block_id": 168,
							"id": 103,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 166,
							"created_at": "2015-06-02T01:47:03.363+05:30",
							"updated_at": "2015-06-02T01:47:03.363+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}]
				}, {
					"id": 46,
					"order": 2,
					"name": " + Add Landlord",
					"description": "",
					"is_repeatable": false,
					"is_optional": false,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 169,
						"order": 1,
						"tag": "Add-Repeatable",
						"name": "Add another landlord?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "No",
						"label": "landlord_add",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}]
				}]
			}, {
				"id": 18,
				"order": 2,
				"name": "Tenant",
				"description": "Details about the tenant(s) to whom the property is being rented out to.",
				"image_url": null,
				"label": null,
				"agreement_step_sections": [{
					"id": 47,
					"order": 1,
					"name": "Tenant",
					"description": "",
					"is_repeatable": true,
					"is_optional": null,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 170,
						"order": 1,
						"tag": "share_t_name",
						"name": "What is the tenant's name?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "E.g. John Doe",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "tenant_name",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "Please enter a valid name.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": []
					}, {
						"id": 172,
						"order": 2,
						"tag": "",
						"name": "What is their permanent address?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "party_address",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": []
					}, {
						"id": 171,
						"order": 3,
						"tag": "",
						"name": "What is their PAN? (optional)",
						"helper_text": "Please enter the 10 digit PAN number.",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "E.g. ABCDE1234F",
						"options": [],
						"regex": "^[a-zA-Z]{5}\\d{4}[a-zA-Z]{1}$",
						"is_mandatory": false,
						"default_answer": "",
						"label": "party_pan",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "Uppercase",
						"sensitive": true,
						"logics": []
					}]
				}, {
					"id": 48,
					"order": 2,
					"name": " + Add Tenant",
					"description": "",
					"is_repeatable": false,
					"is_optional": false,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 173,
						"order": 1,
						"tag": "Add-Repeatable",
						"name": "Add another tenant?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "No",
						"label": "tenant_add",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}]
				}]
			}, {
				"id": 19,
				"order": 3,
				"name": "Property",
				"description": "Details about the configuration and address of the property being rented out.",
				"image_url": null,
				"label": null,
				"agreement_step_sections": [{
					"id": 49,
					"order": 1,
					"name": "Property Configuration",
					"description": "",
					"is_repeatable": null,
					"is_optional": null,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 174,
						"order": 1,
						"tag": "",
						"name": "What type of property are you renting?\t",
						"helper_text": "",
						"question_type_id": 2,
						"question_type_name": "Image Radio",
						"placeholder": "",
						"options": [{
							"name": "Apartment",
							"imgcode": "building",
							"seq": "1",
							"tip": ""
						}, {
							"name": "Independent House",
							"imgcode": "ra-property",
							"seq": "2",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ppt_config_type",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "Please select one.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 176,
						"order": 2,
						"tag": "bedroom_count",
						"name": "How many bedrooms does it have?\t",
						"helper_text": "",
						"question_type_id": 5,
						"question_type_name": "Numeric",
						"placeholder": "",
						"options": [],
						"regex": "^0*[1-9]\\d*(.5){0,1}$",
						"is_mandatory": true,
						"default_answer": "2",
						"label": "ppt_config_bedrooms",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 177,
						"order": 3,
						"tag": "bathroom_count",
						"name": "How many bathrooms does it have?",
						"helper_text": "",
						"question_type_id": 5,
						"question_type_name": "Numeric",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "2",
						"label": "ppt_config_bathrooms",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 175,
						"order": 4,
						"tag": "area",
						"name": "What is the area (built-up) of the property?\t",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "E.g. 1080",
						"options": [],
						"regex": "^0*[1-9]\\d*$",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ppt_config_area",
						"after_placeholder_text": "sq.ft.",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "Please enter a valid input.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}]
				}, {
					"id": 50,
					"order": 2,
					"name": "Property Address",
					"description": "",
					"is_repeatable": null,
					"is_optional": null,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 178,
						"order": 1,
						"tag": "Address Attribute",
						"name": "Flat no.",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "E.g. A-301",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ppt_add_flat",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": [{
							"block_id": 178,
							"id": 104,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Apartment",
							"master_question_id": 174,
							"created_at": "2015-06-02T01:47:03.369+05:30",
							"updated_at": "2015-06-02T01:47:03.369+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 179,
						"order": 2,
						"tag": "Address Attribute",
						"name": "Floor",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "E.g. 3",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ppt_add_floor",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": [{
							"block_id": 179,
							"id": 105,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Apartment",
							"master_question_id": 174,
							"created_at": "2015-06-02T01:47:03.375+05:30",
							"updated_at": "2015-06-02T01:47:03.375+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 183,
						"order": 3,
						"tag": "Address Attribute",
						"name": "Name of the House",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ppt_add_house_name",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": [{
							"block_id": 183,
							"id": 106,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Independent House",
							"master_question_id": 174,
							"created_at": "2015-06-02T01:47:03.381+05:30",
							"updated_at": "2015-06-02T01:47:03.381+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 184,
						"order": 4,
						"tag": "Address Attribute",
						"name": "Name of the Building",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ppt_add_building_name",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": [{
							"block_id": 184,
							"id": 110,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Apartment",
							"master_question_id": 174,
							"created_at": "2015-06-08T17:46:32.086+05:30",
							"updated_at": "2015-06-08T17:46:32.086+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 180,
						"order": 5,
						"tag": "Street Address",
						"name": "Street Address",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ppt_add_street",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": []
					}, {
						"id": 181,
						"order": 6,
						"tag": "City",
						"name": "City",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ppt_add_city",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 182,
						"order": 8,
						"tag": "Pincode",
						"name": "Pincode",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "^[0-9]{6}$",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ppt_add_pincode",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This pin code is incorrect.",
						"validation_confirm_message": "Please enter a valid 6 digit pin-code.",
						"formatting": "",
						"sensitive": true,
						"logics": []
					}]
				}]
			}, {
				"id": 20,
				"order": 4,
				"name": "Commercials",
				"description": "Details about the period, rent and security deposit of the agreement.",
				"image_url": null,
				"label": null,
				"agreement_step_sections": [{
					"id": 51,
					"order": 1,
					"name": "Period",
					"description": "",
					"is_repeatable": null,
					"is_optional": null,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 185,
						"order": 1,
						"tag": "",
						"name": "When will the agreement be signed?",
						"helper_text": "",
						"question_type_id": 7,
						"question_type_name": "Date",
						"placeholder": "DD/MM/YYYY",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "com_period_sign_date",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "This is the date of execution of the agreement i.e. the date on which all parties sign the document.",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "AfterToday",
						"sensitive": false,
						"logics": []
					}, {
						"id": 186,
						"order": 2,
						"tag": "duration_months_fees",
						"name": "What is the duration of the agreement?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "^0*[1-9]\\d*$",
						"is_mandatory": true,
						"default_answer": "11",
						"label": "com_period_duration",
						"after_placeholder_text": "months",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "Please enter a valid input.",
						"validation_confirm_message": "",
						"formatting": "Duration",
						"sensitive": false,
						"logics": []
					}, {
						"id": 187,
						"order": 3,
						"tag": "StartDate",
						"name": "When will the agreement start?",
						"helper_text": "Hint: You can also pick your date from the calendar below.",
						"question_type_id": 7,
						"question_type_name": "Date",
						"placeholder": "DD/MM/YYYY",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "com_period_start_date",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "Duration",
						"sensitive": false,
						"logics": []
					}, {
						"id": 188,
						"order": 4,
						"tag": "",
						"name": "Is the tenant required to give a notice before terminating the agreement?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "com_if_notice",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 282,
						"order": null,
						"tag": "",
						"name": "What is the notice period?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "^0*([1-9][0-9]?|1[0-7][0-9]|180)$",
						"is_mandatory": true,
						"default_answer": "",
						"label": "2_com_period_notice",
						"after_placeholder_text": "days",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "Please enter a valid input.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 282,
							"id": 177,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 188,
							"created_at": "2015-06-11T07:14:02.984+05:30",
							"updated_at": "2015-06-11T07:14:02.984+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}]
				}, {
					"id": 52,
					"order": 2,
					"name": "Rent and Security Deposit",
					"description": "",
					"is_repeatable": null,
					"is_optional": null,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 190,
						"order": 1,
						"tag": "monthly_rent_fees",
						"name": "What is the monthly rent?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "^[0-9]{1,}$",
						"is_mandatory": true,
						"default_answer": "",
						"label": "com_rns_rent",
						"after_placeholder_text": "",
						"before_placeholder_text": "Rs. ",
						"info": "",
						"validation_error_message": "Please enter a valid input.",
						"validation_confirm_message": "",
						"formatting": "CommaSeperatedAndWords",
						"sensitive": false,
						"logics": []
					}, {
						"id": 191,
						"order": 2,
						"tag": "",
						"name": "When is it due each month?",
						"helper_text": "",
						"question_type_id": 1,
						"question_type_name": "Day of Month",
						"placeholder": "DD",
						"options": [],
						"regex": "^0*([1-9]|([12][0-9])|3[01])$",
						"is_mandatory": true,
						"default_answer": "",
						"label": "com_rns_due_date",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 192,
						"order": 3,
						"tag": "security_deposit_check",
						"name": "Is a security deposit required to be paid?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "No",
						"label": "com_rns_if_deposit",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 193,
						"order": 4,
						"tag": "security_deposit_fees",
						"name": "What is the security deposit amount?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "^[0-9]{1,}$",
						"is_mandatory": true,
						"default_answer": "",
						"label": "com_rns_deposit_amount",
						"after_placeholder_text": "",
						"before_placeholder_text": "Rs. ",
						"info": "",
						"validation_error_message": "Please enter a valid input.",
						"validation_confirm_message": "",
						"formatting": "CommaSeperatedAndWords",
						"sensitive": false,
						"logics": [{
							"block_id": 193,
							"id": 108,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 192,
							"created_at": "2015-06-02T01:47:03.392+05:30",
							"updated_at": "2015-06-02T01:47:03.392+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 194,
						"order": 5,
						"tag": "",
						"name": "Can the agreement be renewed after expiration?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "Do not specify",
						"label": "com_rns_if_renew",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 195,
						"order": 6,
						"tag": "increment_rate_fees",
						"name": "What will be the increment in rent after renewal? (optional)",
						"helper_text": "Leave blank if you do not wish to specify.",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "^(0*([1-9]|[1-4][0-9]|50)([.][0-9]{1,2})?)$",
						"is_mandatory": false,
						"default_answer": "",
						"label": "com_rns_increment",
						"after_placeholder_text": "%",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "Please enter a valid input.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 195,
							"id": 109,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 194,
							"created_at": "2015-06-02T01:47:03.398+05:30",
							"updated_at": "2015-06-02T01:47:03.398+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}]
				}]
			}, {
				"id": 21,
				"order": 5,
				"name": "Additional Clauses (optional)",
				"description": "Customise your rental agreement by adding clauses related to parking, lock-in period, pets etc. These are optional.",
				"image_url": null,
				"label": null,
				"agreement_step_sections": [{
					"id": 63,
					"order": 1,
					"name": "Choose Additional Clauses",
					"description": "",
					"is_repeatable": false,
					"is_optional": false,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 196,
						"order": null,
						"tag": "Choose-Optional",
						"name": "Choose Optional Clauses",
						"helper_text": "",
						"question_type_id": 6,
						"question_type_name": "Multiple Choice",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "choose_additional",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}]
				}, {
					"id": 53,
					"order": 2,
					"name": "Parking",
					"description": "Select this clause if you want to add details about parking spaces (if any) that are being provided to the tenant along-with the property.",
					"is_repeatable": false,
					"is_optional": true,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 197,
						"order": 1,
						"tag": "",
						"name": "Is parking available to the tenant?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "No",
						"label": "ac_parking_if_parking",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 198,
						"order": 2,
						"tag": "",
						"name": "How many parking spaces are available?",
						"helper_text": "",
						"question_type_id": 5,
						"question_type_name": "Numeric",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "1",
						"label": "ac_parking_amount",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 198,
							"id": 122,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 197,
							"created_at": "2015-06-10T06:13:10.142+05:30",
							"updated_at": "2015-06-10T06:13:10.142+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 224,
						"order": 3,
						"tag": "",
						"name": "How is the parking fees to be paid?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Included in monthly rent",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Paid separately",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_parking_medium",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 224,
							"id": 168,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 197,
							"created_at": "2015-06-11T03:20:25.796+05:30",
							"updated_at": "2015-06-11T03:20:25.796+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 199,
						"order": 4,
						"tag": "",
						"name": "What is the monthly parking fee? (optional)",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "^\\d*$",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_parking_fee",
						"after_placeholder_text": "",
						"before_placeholder_text": "Rs. ",
						"info": "",
						"validation_error_message": "Please enter a valid input.",
						"validation_confirm_message": "",
						"formatting": "CommaSeperated",
						"sensitive": false,
						"logics": [{
							"block_id": 199,
							"id": 123,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 197,
							"created_at": "2015-06-10T06:13:10.146+05:30",
							"updated_at": "2015-06-10T06:13:10.146+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 200,
						"order": 5,
						"tag": "",
						"name": "What are the parking numbers? (optional)",
						"helper_text": "Please enter the parking numbers separated by commas.",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "E.g. 11, 22",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_parking_numbers",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 200,
							"id": 124,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 197,
							"created_at": "2015-06-10T06:13:10.150+05:30",
							"updated_at": "2015-06-10T06:13:10.150+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}]
				}, {
					"id": 91,
					"order": 3,
					"name": "Painting",
					"description": "Select this clause if the tenant is required to re-paint the property before moving out. You can also add details about penalty charges (if any) if the tenant does not meet this requirement.",
					"is_repeatable": false,
					"is_optional": true,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 388,
						"order": 1,
						"tag": "",
						"name": "Is the tenant required to repaint the property before moving out?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_painting_if",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 389,
						"order": 2,
						"tag": "",
						"name": "How much penalty will the tenant be charged for not repainting the property before moving out?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_painting_penalty",
						"after_placeholder_text": "",
						"before_placeholder_text": "Rs.",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 389,
							"id": 245,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 388,
							"created_at": "2015-06-12T05:36:17.616+05:30",
							"updated_at": "2015-06-12T05:36:17.616+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}]
				}, {
					"id": 54,
					"order": 4,
					"name": "Lock-in Period",
					"description": "Select this clause to add details about the lock-in period (if any). Lock-in period is a period within which any party or both parties cannot terminate the agreement. ",
					"is_repeatable": false,
					"is_optional": true,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 201,
						"order": null,
						"tag": "",
						"name": "Is there a lock-in period?\t",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_lockin_if_lockin",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 202,
						"order": null,
						"tag": "",
						"name": "What is the lock-in Period?",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "^0*([1-9]|1[0-2])$",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_lockin_period",
						"after_placeholder_text": "months",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "Please enter a valid input.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 202,
							"id": 173,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 201,
							"created_at": "2015-06-11T05:46:02.084+05:30",
							"updated_at": "2015-06-11T05:46:02.084+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 203,
						"order": null,
						"tag": "",
						"name": "Will the tenant be required to pay the balance rent if he/she vacates the property before the lock-in period?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_lockin_vacate",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 203,
							"id": 174,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 201,
							"created_at": "2015-06-11T05:46:02.088+05:30",
							"updated_at": "2015-06-11T05:46:02.088+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}]
				}, {
					"id": 55,
					"order": 5,
					"name": "Maintenance, Utilities and Other Charges",
					"description": "Select this clause if you want to specify who pays for utilities, society maintenance, documentation, stamp duty and registration fees.",
					"is_repeatable": false,
					"is_optional": true,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 204,
						"order": 1,
						"tag": "",
						"name": "Is the tenant required to pay for utilities?\t",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_muc_utilities",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 205,
						"order": 2,
						"tag": "",
						"name": "Who will the society maintenance charges be paid by?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Landlord",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Tenant",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Landlord",
						"label": "ac_muc_who_pays",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 279,
						"order": 3,
						"tag": "",
						"name": "Who will pay the documentation, registration and stamp duty charges?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Landlord(s)",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Tenant(s)",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Landlord(s) and Tenant(s)",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Landlord(s) and Tenant(s)",
						"label": "ac_muc_doc",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}]
				}, {
					"id": 56,
					"order": 6,
					"name": "Rights and Obligations of Landlord",
					"description": "Select this clause if you want to specify what happens when the water supply is erratic or if the landlord sells the property within the agreement period.",
					"is_repeatable": false,
					"is_optional": true,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 229,
						"order": null,
						"tag": "",
						"name": "If the water supply is erratic, is the landlord required to make arrangements for adequate water supply?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_muc_water",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 230,
						"order": null,
						"tag": "",
						"name": "If the landlord sells the property within the agreement period, does the tenant have the right to occupy the property till the end of it?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_muc_sells",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}]
				}, {
					"id": 57,
					"order": 7,
					"name": "Breach of Contract",
					"description": "Select this clause if you want to specify how the tenant will be penalised for late payments. You can also specify what happens if the tenant does not vacate the property at the termination/expiry of the agreement.",
					"is_repeatable": false,
					"is_optional": true,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 235,
						"order": 1,
						"tag": "",
						"name": "How will the tenant be penalised for late payment?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Fixed charge per late payment",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Interest for the default days",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_boc_how",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 234,
						"order": 2,
						"tag": "",
						"name": "Late payment charge",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_boc_late",
						"after_placeholder_text": "",
						"before_placeholder_text": "Rs. ",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "CommaSeperated",
						"sensitive": false,
						"logics": [{
							"block_id": 234,
							"id": 126,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Fixed charge per late payment",
							"master_question_id": 235,
							"created_at": "2015-06-10T18:34:05.459+05:30",
							"updated_at": "2015-06-10T18:34:05.459+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 236,
						"order": 3,
						"tag": "",
						"name": "Interest rate per annum",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_interest",
						"after_placeholder_text": "%",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 236,
							"id": 127,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Interest for the default days",
							"master_question_id": 235,
							"created_at": "2015-06-10T18:34:05.466+05:30",
							"updated_at": "2015-06-10T18:34:05.466+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 233,
						"order": 5,
						"tag": "",
						"name": "After how many months of late payments will the agreement be terminated? (optional)",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_boc_terminate",
						"after_placeholder_text": "months",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 231,
						"order": 6,
						"tag": "",
						"name": "If the tenant does not vacate the property on termination/expiry of the agreement, is he required to pay a penalty?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_boc_vacate_penalty",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 232,
						"order": 7,
						"tag": "",
						"name": "Penalty per day",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_boc_penalty_day",
						"after_placeholder_text": "",
						"before_placeholder_text": "Rs.",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "CommaSeperated",
						"sensitive": false,
						"logics": [{
							"block_id": 232,
							"id": 180,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 231,
							"created_at": "2015-06-11T20:37:29.665+05:30",
							"updated_at": "2015-06-11T20:37:29.665+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}]
				}, {
					"id": 58,
					"order": 8,
					"name": "Additional Security Deposit Details",
					"description": "Select this clause if you want to add details about how the security deposit is paid. You can also add details about what happens if the landlord fails to return the security deposit.",
					"is_repeatable": false,
					"is_optional": true,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 220,
						"order": 1,
						"tag": "",
						"name": "By what medium will the security deposit be paid?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Cheque",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Demand Draft",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Net Banking",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Cash",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_asdd_deposit_medium",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 213,
						"order": 2,
						"tag": "",
						"name": "Demand Draft Number",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_asdd_dd",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": [{
							"block_id": 213,
							"id": 112,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Demand Draft",
							"master_question_id": 220,
							"created_at": "2015-06-10T05:25:01.750+05:30",
							"updated_at": "2015-06-10T05:25:01.750+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 216,
						"order": 2,
						"tag": "",
						"name": "Transaction Reference ID",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_asdd_trid",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": [{
							"block_id": 216,
							"id": 113,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Net Banking",
							"master_question_id": 220,
							"created_at": "2015-06-10T05:25:01.754+05:30",
							"updated_at": "2015-06-10T05:25:01.754+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 218,
						"order": 2,
						"tag": "",
						"name": "Cheque Number",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_asdd_cheque",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": [{
							"block_id": 218,
							"id": 114,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Cheque",
							"master_question_id": 220,
							"created_at": "2015-06-10T05:25:01.757+05:30",
							"updated_at": "2015-06-10T05:25:01.757+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 217,
						"order": 3,
						"tag": "",
						"name": "Dated",
						"helper_text": "",
						"question_type_id": 7,
						"question_type_name": "Date",
						"placeholder": "DD/MM/YYYY",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_asdd_dated",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": true,
						"logics": [{
							"block_id": 217,
							"id": 115,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 2,
							"value": "Cash",
							"master_question_id": 220,
							"created_at": "2015-06-10T05:25:01.760+05:30",
							"updated_at": "2015-06-10T05:25:01.760+05:30",
							"operator": {
								"id": 2,
								"name": "!=",
								"created_at": "2015-05-27T02:14:05.801+05:30",
								"updated_at": "2015-05-27T02:14:05.801+05:30"
							}
						}, {
							"block_id": 217,
							"id": 116,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 2,
							"value": "Do not specify",
							"master_question_id": 220,
							"created_at": "2015-06-10T05:25:01.763+05:30",
							"updated_at": "2015-06-10T05:25:01.763+05:30",
							"operator": {
								"id": 2,
								"name": "!=",
								"created_at": "2015-05-27T02:14:05.801+05:30",
								"updated_at": "2015-05-27T02:14:05.801+05:30"
							}
						}]
					}, {
						"id": 214,
						"order": 4,
						"tag": "",
						"name": "Name of the Bank",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_asdd_bank",
						"after_placeholder_text": "Bank",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 214,
							"id": 175,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 2,
							"value": "Cash",
							"master_question_id": 220,
							"created_at": "2015-06-11T05:46:02.112+05:30",
							"updated_at": "2015-06-11T05:46:02.112+05:30",
							"operator": {
								"id": 2,
								"name": "!=",
								"created_at": "2015-05-27T02:14:05.801+05:30",
								"updated_at": "2015-05-27T02:14:05.801+05:30"
							}
						}, {
							"block_id": 214,
							"id": 176,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 2,
							"value": "Do not specify",
							"master_question_id": 220,
							"created_at": "2015-06-11T05:46:02.116+05:30",
							"updated_at": "2015-06-11T05:46:02.116+05:30",
							"operator": {
								"id": 2,
								"name": "!=",
								"created_at": "2015-05-27T02:14:05.801+05:30",
								"updated_at": "2015-05-27T02:14:05.801+05:30"
							}
						}]
					}, {
						"id": 215,
						"order": 5,
						"tag": "",
						"name": "Branch",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_asdd_branch",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 215,
							"id": 117,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 2,
							"value": "Do not specify",
							"master_question_id": 220,
							"created_at": "2015-06-10T05:25:01.766+05:30",
							"updated_at": "2015-06-10T05:25:01.766+05:30",
							"operator": {
								"id": 2,
								"name": "!=",
								"created_at": "2015-05-27T02:14:05.801+05:30",
								"updated_at": "2015-05-27T02:14:05.801+05:30"
							}
						}, {
							"block_id": 215,
							"id": 118,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 2,
							"value": "Cash",
							"master_question_id": 220,
							"created_at": "2015-06-10T05:25:01.769+05:30",
							"updated_at": "2015-06-10T05:25:01.769+05:30",
							"operator": {
								"id": 2,
								"name": "!=",
								"created_at": "2015-05-27T02:14:05.801+05:30",
								"updated_at": "2015-05-27T02:14:05.801+05:30"
							}
						}]
					}, {
						"id": 221,
						"order": 6,
						"tag": "",
						"name": "Can the tenant stay on the property if the landlord is unable to return the security deposit on expiry/termination of the agreement?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_asdd_stay",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 219,
						"order": 7,
						"tag": "",
						"name": "How will the landlord be penalised if he is unable to pay back the security deposit after the expiry/termination of the agreement?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Interest for the default days",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Fixed amount per day",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No penalty",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_asdd_payback",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 223,
						"order": 8,
						"tag": "",
						"name": "Amount per day",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_asdd_amount",
						"after_placeholder_text": "",
						"before_placeholder_text": "Rs. ",
						"info": "",
						"validation_error_message": "This is a required field.",
						"validation_confirm_message": "",
						"formatting": "CommaSeperated",
						"sensitive": false,
						"logics": [{
							"block_id": 223,
							"id": 121,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Fixed amount per day",
							"master_question_id": 219,
							"created_at": "2015-06-10T05:50:05.796+05:30",
							"updated_at": "2015-06-10T05:50:05.796+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 222,
						"order": 8,
						"tag": "",
						"name": "Interest rate per annum",
						"helper_text": "",
						"question_type_id": 4,
						"question_type_name": "Text",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "",
						"label": "ac_interest",
						"after_placeholder_text": "%",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "This is required.",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 222,
							"id": 119,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Interest for the default days",
							"master_question_id": 219,
							"created_at": "2015-06-10T05:25:01.772+05:30",
							"updated_at": "2015-06-10T05:25:01.772+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}]
				}, {
					"id": 59,
					"order": 9,
					"name": "Pets",
					"description": "Select this clause to specify the policy on pets.",
					"is_repeatable": false,
					"is_optional": true,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 276,
						"order": 1,
						"tag": "",
						"name": "Is the tenant allowed to keep pets on the property?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_pets_if_pets",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 273,
						"order": 2,
						"tag": "",
						"name": "Will the pet be allowed to enter the shared society amenities and recreational areas?\r\n",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_pets_society",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 273,
							"id": 165,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 276,
							"created_at": "2015-06-10T18:46:03.963+05:30",
							"updated_at": "2015-06-10T18:46:03.963+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 274,
						"order": 3,
						"tag": "",
						"name": "After vacating the property, will the tenant be responsible for de-fleeing, deodorizing etc. of the property?\r\n",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_pets_vacate",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 274,
							"id": 166,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 276,
							"created_at": "2015-06-10T18:46:03.966+05:30",
							"updated_at": "2015-06-10T18:46:03.966+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 275,
						"order": 4,
						"tag": "",
						"name": "Does the landlord have the right to turn over the pet to animal welfare if he determines that the tenant does not provide adequate care?\r\n",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_pets_welfare",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 275,
							"id": 167,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 276,
							"created_at": "2015-06-10T18:46:03.969+05:30",
							"updated_at": "2015-06-10T18:46:03.969+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}]
				}, {
					"id": 61,
					"order": 10,
					"name": "Repairs and Alterations",
					"description": "Select this clause if the tenant is allowed to make  additions/alterations to the property. You can also specify who will bear the cost of internal non-structural repairs.",
					"is_repeatable": false,
					"is_optional": true,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 227,
						"order": 1,
						"tag": "",
						"name": "Is the tenant allowed to make additions and alterations (structural or otherwise) to the property?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes, without consent",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Yes, with consent",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_fnf_alterations",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 228,
						"order": 2,
						"tag": "",
						"name": "Who will bear the cost of internal non-structural repairs, and repairs and replacement of the fittings and fixtures?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Landlord(s)",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Tenant(s)",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Landlord(s) and Tenant(s)",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "Do not specify",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": true,
						"default_answer": "Do not specify",
						"label": "ac_fnf_repairs_cost",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}]
				}, {
					"id": 60,
					"order": 11,
					"name": "Fittings and Furnishings",
					"description": "Select this clause if you want to add details about the fittings and furnishings provided to the tenant along-with the property.",
					"is_repeatable": false,
					"is_optional": true,
					"logics": [],
					"agreement_step_section_questions": [{
						"id": 237,
						"order": 1,
						"tag": "",
						"name": "Would you like to add details about the fittings and furnishings that come with the property?",
						"helper_text": "",
						"question_type_id": 3,
						"question_type_name": "Radio",
						"placeholder": "",
						"options": [{
							"name": "Yes",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}, {
							"name": "No",
							"imgcode": "",
							"seq": "",
							"tip": ""
						}],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "No",
						"label": "ac_fnf_add_furnishings",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": []
					}, {
						"id": 238,
						"order": 2,
						"tag": "",
						"name": "KITCHEN APPLIANCES",
						"helper_text": "",
						"question_type_id": 8,
						"question_type_name": "Sub Heading",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "kitchen_appliances",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 238,
							"id": 130,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.840+05:30",
							"updated_at": "2015-06-10T18:46:03.840+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 239,
						"order": 3,
						"tag": "",
						"name": "Refrigerator\r\n",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_fridge",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 239,
							"id": 131,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.845+05:30",
							"updated_at": "2015-06-10T18:46:03.845+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 240,
						"order": 4,
						"tag": "",
						"name": "Microwave",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_microwave",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 240,
							"id": 132,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.849+05:30",
							"updated_at": "2015-06-10T18:46:03.849+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 241,
						"order": 5,
						"tag": "",
						"name": "Oven",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_oven",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 241,
							"id": 133,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.853+05:30",
							"updated_at": "2015-06-10T18:46:03.853+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 242,
						"order": 6,
						"tag": "",
						"name": "Gas Stove",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_stove",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 242,
							"id": 134,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.857+05:30",
							"updated_at": "2015-06-10T18:46:03.857+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 243,
						"order": 7,
						"tag": "",
						"name": "Chimney",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_chimney",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 243,
							"id": 135,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.861+05:30",
							"updated_at": "2015-06-10T18:46:03.861+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 244,
						"order": 8,
						"tag": "",
						"name": "Water Purifier",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_purifier",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 244,
							"id": 136,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.865+05:30",
							"updated_at": "2015-06-10T18:46:03.865+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 245,
						"order": 9,
						"tag": "",
						"name": "Gas Connection",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_gas",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 245,
							"id": 137,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.869+05:30",
							"updated_at": "2015-06-10T18:46:03.869+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 246,
						"order": 10,
						"tag": "",
						"name": "FURNITURE",
						"helper_text": "",
						"question_type_id": 8,
						"question_type_name": "Sub Heading",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_h_furniture",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 246,
							"id": 138,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.872+05:30",
							"updated_at": "2015-06-10T18:46:03.872+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 247,
						"order": 11,
						"tag": "",
						"name": "Dining Table",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_dining",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 247,
							"id": 139,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.876+05:30",
							"updated_at": "2015-06-10T18:46:03.876+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 248,
						"order": 12,
						"tag": "",
						"name": "Side Table",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_side",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 248,
							"id": 140,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.880+05:30",
							"updated_at": "2015-06-10T18:46:03.880+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 249,
						"order": 13,
						"tag": "",
						"name": "Centre Table",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_centre",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 249,
							"id": 141,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.884+05:30",
							"updated_at": "2015-06-10T18:46:03.884+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 250,
						"order": 14,
						"tag": "",
						"name": "Study Table",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_study",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 250,
							"id": 142,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.887+05:30",
							"updated_at": "2015-06-10T18:46:03.887+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 251,
						"order": 15,
						"tag": "",
						"name": "Sofa Set",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_sofa",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 251,
							"id": 143,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.891+05:30",
							"updated_at": "2015-06-10T18:46:03.891+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 252,
						"order": 16,
						"tag": "",
						"name": "Chairs",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_chairs",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 252,
							"id": 144,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.894+05:30",
							"updated_at": "2015-06-10T18:46:03.894+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 253,
						"order": 17,
						"tag": "",
						"name": "Cupboard",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_cupboard",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 253,
							"id": 145,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.898+05:30",
							"updated_at": "2015-06-10T18:46:03.898+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 254,
						"order": 18,
						"tag": "",
						"name": "Book Shelf",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_shelf",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 254,
							"id": 146,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.901+05:30",
							"updated_at": "2015-06-10T18:46:03.901+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 255,
						"order": 19,
						"tag": "",
						"name": "ELECTRONICS",
						"helper_text": "",
						"question_type_id": 8,
						"question_type_name": "Sub Heading",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_h_electronics",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 255,
							"id": 147,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.905+05:30",
							"updated_at": "2015-06-10T18:46:03.905+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 256,
						"order": 20,
						"tag": "",
						"name": "Set Top Box\r\n",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_box",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 256,
							"id": 148,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.908+05:30",
							"updated_at": "2015-06-10T18:46:03.908+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 257,
						"order": 21,
						"tag": "",
						"name": "Satellite Dish",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_dish",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 257,
							"id": 149,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.911+05:30",
							"updated_at": "2015-06-10T18:46:03.911+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 258,
						"order": 22,
						"tag": "",
						"name": "Wi-Fi Router\r\n",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_wifi",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 258,
							"id": 150,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.914+05:30",
							"updated_at": "2015-06-10T18:46:03.914+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 259,
						"order": 23,
						"tag": "",
						"name": "Ceiling Fan\r\n",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_fan",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 259,
							"id": 151,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.918+05:30",
							"updated_at": "2015-06-10T18:46:03.918+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 260,
						"order": 24,
						"tag": "",
						"name": "Landline Phone",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_landline",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 260,
							"id": 152,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.921+05:30",
							"updated_at": "2015-06-10T18:46:03.921+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 261,
						"order": 25,
						"tag": "",
						"name": "Air Conditioner",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_ac",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 261,
							"id": 153,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.924+05:30",
							"updated_at": "2015-06-10T18:46:03.924+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 262,
						"order": 26,
						"tag": "",
						"name": "Television",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_tv",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 262,
							"id": 154,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.927+05:30",
							"updated_at": "2015-06-10T18:46:03.927+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 263,
						"order": 27,
						"tag": "",
						"name": "BATHROOM",
						"helper_text": "",
						"question_type_id": 8,
						"question_type_name": "Sub Heading",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "bathroom",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 263,
							"id": 155,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.931+05:30",
							"updated_at": "2015-06-10T18:46:03.931+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 264,
						"order": 28,
						"tag": "",
						"name": "Shower",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_shower",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 264,
							"id": 156,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.934+05:30",
							"updated_at": "2015-06-10T18:46:03.934+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 265,
						"order": 29,
						"tag": "",
						"name": "Tap",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_tap",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 265,
							"id": 157,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.937+05:30",
							"updated_at": "2015-06-10T18:46:03.937+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 266,
						"order": 30,
						"tag": "",
						"name": "Geyser",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_geyser",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 266,
							"id": 158,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.941+05:30",
							"updated_at": "2015-06-10T18:46:03.941+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 267,
						"order": 31,
						"tag": "",
						"name": "Exhaust Fan",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_exhaust",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 267,
							"id": 159,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.944+05:30",
							"updated_at": "2015-06-10T18:46:03.944+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 268,
						"order": 32,
						"tag": "",
						"name": "LIGHTING",
						"helper_text": "",
						"question_type_id": 8,
						"question_type_name": "Sub Heading",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_h_lighting",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 268,
							"id": 160,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.947+05:30",
							"updated_at": "2015-06-10T18:46:03.947+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 269,
						"order": 33,
						"tag": "",
						"name": "Bulb",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_bulb",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 269,
							"id": 161,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.950+05:30",
							"updated_at": "2015-06-10T18:46:03.950+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 270,
						"order": 34,
						"tag": "",
						"name": "Tubelight",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_tube",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 270,
							"id": 162,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.954+05:30",
							"updated_at": "2015-06-10T18:46:03.954+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 271,
						"order": 35,
						"tag": "",
						"name": "OTHERS",
						"helper_text": "",
						"question_type_id": 8,
						"question_type_name": "Sub Heading",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "others",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 271,
							"id": 163,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.957+05:30",
							"updated_at": "2015-06-10T18:46:03.957+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 277,
						"order": 36,
						"tag": "",
						"name": "Curtain",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_curtain",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 277,
							"id": 178,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-11T07:31:31.786+05:30",
							"updated_at": "2015-06-11T07:31:31.786+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 278,
						"order": 37,
						"tag": "",
						"name": "Curtain Rod",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_rod",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 278,
							"id": 179,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-11T07:31:31.794+05:30",
							"updated_at": "2015-06-11T07:31:31.794+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}, {
						"id": 272,
						"order": 38,
						"tag": "CustomNumeric",
						"name": "Add Other",
						"helper_text": "",
						"question_type_id": 9,
						"question_type_name": "Furnishing",
						"placeholder": "",
						"options": [],
						"regex": "",
						"is_mandatory": false,
						"default_answer": "",
						"label": "ac_fnf_custom",
						"after_placeholder_text": "",
						"before_placeholder_text": "",
						"info": "",
						"validation_error_message": "",
						"validation_confirm_message": "",
						"formatting": "",
						"sensitive": false,
						"logics": [{
							"block_id": 272,
							"id": 164,
							"block_type": "AgreementStepSectionQuestion",
							"operator_id": 1,
							"value": "Yes",
							"master_question_id": 237,
							"created_at": "2015-06-10T18:46:03.960+05:30",
							"updated_at": "2015-06-10T18:46:03.960+05:30",
							"operator": {
								"id": 1,
								"name": "==",
								"created_at": "2015-05-27T02:14:05.796+05:30",
								"updated_at": "2015-05-27T02:14:05.796+05:30"
							}
						}]
					}]
				}]
			}]
		}
	},
	"answers": [{
		"ques_id": 181,
		"body": "Bengaluru",
		"diff_id": null
	}]
};
});

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    hasProp = {}.hasOwnProperty;

  define('backbone/helpers/rental_agreements/rental_agreements_utils',['backbone/assets', 'backbone/models/rental_agreements/ra_fees_model', 'backbone/helpers/rental_agreements/bangalore'], function(Housing, RAFeesModel, AgreementData) {
    var RentalAgreementUtil;
    RentalAgreementUtil = (function() {
      RentalAgreementUtil.prototype.tag = {
        t: "tenant",
        ld: "landlord",
        poa: "poa"
      };

      RentalAgreementUtil.prototype.MAX_REPEATABLE = 10;

      RentalAgreementUtil.prototype.personalised_order = {
        landlord: ['Landlord', 'Property', 'Commercials', 'Tenant', 'Witness', 'Additional Clauses (optional)'],
        tenant: ['Tenant', 'Property', 'Commercials', 'Landlord', 'Witness', 'Additional Clauses (optional)']
      };

      RentalAgreementUtil.prototype.personalise_steps = function(steps, side) {
        var personalised_steps, steps_map;
        if (side == null) {
          side = 'tenant';
        }
        if (!this.personalised_order[side]) {
          side = 'tenant';
        }
        steps_map = _.indexBy(steps, 'name');
        personalised_steps = [];
        this.personalised_order[side].forEach(function(step_name) {
          if (steps_map[step_name]) {
            return personalised_steps.push(steps_map[step_name]);
          }
        });
        return personalised_steps;
      };

      RentalAgreementUtil.prototype.get_side = function(user_type, user_type_extension) {
        if (user_type == null) {
          user_type = 'tenant';
        }
        if (user_type_extension == null) {
          user_type_extension = 'tenant';
        }
        if (user_type === 'other' || user_type === 'agent') {
          if (user_type_extension) {
            return user_type_extension;
          }
          return 'tenant';
        }
        return user_type;
      };

      function RentalAgreementUtil(cb) {
        this.publish_sdr = bind(this.publish_sdr, this);
        this.steps = {};
        this.sections = {};
        this.questions = {};
        this.questions_by_tags = {};
        this.sorted_steps = [];
        this.diffs_by_id = {};
        this.unsaved_answers = {};
        this.sdr_fields = {};
        this.last_step = null;
        this.last_section = null;
        this.last_diff = null;
        this.last_question = null;
        this.optional_clauses = [];
        this.optional_clauses_selected = [];
        this.incomplete_steps = [];
        this.share_contacts = {
          landlord: [],
          tenant: [],
          poa: []
        };
        this.update_sdr = _.debounce(this.update_sdr_gen, 800);
        setTimeout((function(_this) {
          return function() {
            return _this.fetch(cb);
          };
        })(this), 0);
      }

      RentalAgreementUtil.prototype.init_callbacks = function(options) {
        return this.options = options;
      };

      RentalAgreementUtil.prototype.init_fees_model = function() {
        this.ra_fees_model = new RAFeesModel(_.extend({
          city_id: this.data.city_id
        }, this.sdr_fields));
        this.ra_fees_model.once('model:init:done', (function(_this) {
          return function() {
            _this.ra_fees_model.on('fees:update:done', _this.publish_sdr);
            return _this.publish_sdr();
          };
        })(this));
        return this.ra_fees_model.on('error:fetching', (function(_this) {
          return function() {
            _this.sdr_values = void 0;
            return _this.options && _this.options.update_sdr();
          };
        })(this));
      };

      RentalAgreementUtil.prototype.publish_sdr = function() {
        var sdr_keys;
        sdr_keys = ['stamp_duty', 'registration_fee', 'convenience_fee', 'total_fees'];
        this.sdr_values = {};
        sdr_keys.forEach((function(_this) {
          return function(key) {
            return _this.sdr_values[key] = Housing.Util.comma_formatted(Math.ceil(_this.ra_fees_model.get(key))) || void 0;
          };
        })(this));
        return this.options && this.options.update_sdr();
      };

      RentalAgreementUtil.prototype.fetch = function(cb) {
        var answer, data, k, l, len, len1, len2, m, ref, ref1, ref2, side, step;
        data = AgreementData;
        if (data.message !== 'Success') {
          return;
        }
        this.data = data.data;
        ref = data.answers;
        for (k = 0, len = ref.length; k < len; k++) {
          answer = ref[k];
          if (answer.diff_id) {
            if (!this.diffs_by_id[answer.ques_id]) {
              this.diffs_by_id[answer.ques_id] = [];
            }
            this.diffs_by_id[answer.ques_id].push(answer.diff_id);
          }
        }
        side = this.get_side(this.data.user_type, this.data.user_type_extension);
        this.sorted_steps = this.personalise_steps(this.data.agreement.agreement_steps, side);
        ref1 = this.sorted_steps;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          step = ref1[l];
          this.precompute_step(this.steps, step);
        }
        this.compute_slaves();
        ref2 = data.answers;
        for (m = 0, len2 = ref2.length; m < len2; m++) {
          answer = ref2[m];
          this.set_answer(answer.ques_id, answer.body, answer.diff_id, true);
        }
        this.update_sdr();
        this.last_step = data.data.last_step_id;
        this.last_section = data.data.last_section_id;
        this.last_diff = data.data.last_diff_id;
        this.last_question = data.data.last_question_id;
        this.download_url = this.data.url;
        this.city_max_duration = this.data.city_max_duration;
        if (!this.ra_fees_model) {
          this.init_fees_model();
        }
        return cb('Success');
      };

      RentalAgreementUtil.prototype.precompute_step = function(steps_obj, step) {
        var k, len, ref, section;
        steps_obj[step.id] = step;
        step.num = 0;
        step.denom = 0;
        step.update_progress = _.debounce(this.step_update_progress_gen, 900);
        this.incomplete_steps.push(step.id);
        ref = step.agreement_step_sections;
        for (k = 0, len = ref.length; k < len; k++) {
          section = ref[k];
          this.precompute_sections(section);
          section.step_id = step.id;
          if (section.is_optional && (-1 === this.optional_clauses.indexOf(section))) {
            this.optional_clauses.push(section);
          }
        }
        return this.step_update_progress(step.id);
      };

      RentalAgreementUtil.prototype.precompute_sections = function(section) {
        var diff_id, diffs, k, l, len, len1, logic, question, ref, ref1, results;
        this.sections[section.id] = section;
        section.questions = {};
        section.basic_denom = 0;
        section.update_progress = _.debounce(this.section_update_progress_gen, 900);
        if (section.is_repeatable) {
          section.diffs = [];
          section.num_diff = {};
          section.cond_decom_diff = {};
        } else {
          section.cond_decom = 0;
          section.num = 0;
        }
        ref = section.agreement_step_section_questions;
        for (k = 0, len = ref.length; k < len; k++) {
          question = ref[k];
          diffs = this.precompute_questions(question, section.is_repeatable);
          question.section_id = section.id;
          if (diffs) {
            diffs = diffs.sort(function(a, b) {
              return a - b;
            });
            section.diffs = this.union(section.diffs, diffs);
          }
          if (!(question.default_answer || question.logics.length || !question.is_mandatory)) {
            section.basic_denom++;
          }
        }
        if (section.is_repeatable) {
          if (!section.diffs.length) {
            section.diffs = [1];
          }
          ref1 = section.diffs;
          results = [];
          for (l = 0, len1 = ref1.length; l < len1; l++) {
            diff_id = ref1[l];
            section.num_diff[diff_id] = 0;
            section.cond_decom_diff[diff_id] = 0;
            results.push((function() {
              var len2, m, ref2, results1;
              ref2 = section.agreement_step_section_questions;
              results1 = [];
              for (m = 0, len2 = ref2.length; m < len2; m++) {
                question = ref2[m];
                question.answer_diff[diff_id] = question.default_answer;
                if (!question.is_mandatory) {
                  question.in_denom_diff[diff_id] = false;
                }
                if (question.logics.length) {
                  question.hidden_diff[diff_id] = true;
                  results1.push((function() {
                    var len3, n, ref3, results2;
                    ref3 = question.logics;
                    results2 = [];
                    for (n = 0, len3 = ref3.length; n < len3; n++) {
                      logic = ref3[n];
                      results2.push(logic.hidden_diff[diff_id] = true);
                    }
                    return results2;
                  })());
                } else {
                  results1.push(void 0);
                }
              }
              return results1;
            })());
          }
          return results;
        }
      };

      RentalAgreementUtil.prototype.precompute_questions = function(question, is_repeatable) {
        var k, l, len, len1, logic, qtag, ref, ref1;
        this.questions[question.id] = question;
        question.regex || (question.regex = false);
        if (!question.regex && (question.question_type_name === 'Numeric' || (question.question_type_name === 'Furnishing' && !(question.tag === 'CustomNumeric')))) {
          question.regex = '^\\d*$';
        }
        qtag = question.tag;
        if (qtag) {
          this.questions_by_tags[qtag] = question;
        }
        if (qtag === 'City') {
          question.default_answer = this.data.city_name;
        }
        if (!question.default_answer) {
          question.default_answer = '';
        }
        if (is_repeatable) {
          question.answer_diff = {};
          if (!question.is_mandatory) {
            question.in_denom_diff = {};
          }
          if (question.logics.length) {
            question.hidden_diff = {};
            ref = question.logics;
            for (k = 0, len = ref.length; k < len; k++) {
              logic = ref[k];
              logic.hidden_diff = {};
            }
          }
        } else {
          question.answer = question.default_answer;
          if (!question.is_mandatory) {
            question.in_denom = false;
          }
          if (question.logics.length) {
            question.hidden = true;
            ref1 = question.logics;
            for (l = 0, len1 = ref1.length; l < len1; l++) {
              logic = ref1[l];
              logic.hidden = true;
            }
          }
        }
        if (is_repeatable && this.diffs_by_id[question.id]) {
          return this.diffs_by_id[question.id];
        }
        if (qtag.indexOf('_fees') > 0) {
          question.fee_type = qtag.substring(0, qtag.length - 5);
          this.sdr_fields[question.fee_type] = question.hidden || !question.is_mandatory ? 0 : question.default_answer || void 0;
          this.last_sdr = qtag;
        }
        return false;
      };

      RentalAgreementUtil.prototype.compute_slaves = function() {
        var logic, master, ques_id, question, ref, results;
        ref = this.questions;
        results = [];
        for (ques_id in ref) {
          question = ref[ques_id];
          if (question.logics.length) {
            results.push((function() {
              var k, len, ref1, results1;
              ref1 = question.logics;
              results1 = [];
              for (k = 0, len = ref1.length; k < len; k++) {
                logic = ref1[k];
                master = this.questions[logic.master_question_id];
                if (master && master.question_type_name.indexOf('Radio') !== -1) {
                  if (!master.slaves) {
                    master.slaves = [];
                  }
                  results1.push(master.slaves.push(parseInt(ques_id)));
                } else {
                  results1.push(void 0);
                }
              }
              return results1;
            }).call(this));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };

      RentalAgreementUtil.prototype.update_slaves = function(question, diff_id) {
        var answer, k, len, ref, results, slave;
        if (!question.slaves) {
          return;
        }
        answer = this.get_diff_field(question, 'answer', diff_id);
        ref = question.slaves;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          slave = ref[k];
          results.push(this.compute_visibility(question.id, answer, slave, diff_id));
        }
        return results;
      };

      RentalAgreementUtil.prototype.compute_visibility = function(master_id, master_ans, slave_id, diff_id) {
        var current_logic, current_logic_done, hide, k, len, logic, question, ref;
        question = this.questions[slave_id];
        if (!question) {
          return;
        }
        if (!question.logics) {
          return;
        }
        hide = false;
        current_logic_done = false;
        ref = question.logics;
        for (k = 0, len = ref.length; k < len; k++) {
          logic = ref[k];
          if (logic.master_question_id === master_id) {
            current_logic_done = true;
            current_logic = false;
            if ((!master_ans) || (logic.operator.name === '==' && master_ans !== logic.value) || (logic.operator.name === '!=' && master_ans === logic.value)) {
              current_logic = true;
            }
            this.set_diff_field(logic, 'hidden', diff_id, current_logic);
            hide = hide || current_logic;
            if (current_logic) {
              break;
            }
          } else {
            hide = hide && this.get_diff_field(logic, 'hidden', diff_id, current_logic);
          }
          if (current_logic_done && hide) {
            break;
          }
        }
        return this.update_visibility(question, hide, diff_id);
      };

      RentalAgreementUtil.prototype.update_visibility = function(question, hide, diff_id) {
        var delta, section, validity;
        section = this.sections[question.section_id];
        if (!section) {
          return;
        }
        if (hide) {
          setTimeout((function(_this) {
            return function() {
              if (_this.options) {
                _this.set_answer(question.id, question.default_answer, diff_id, false, true);
                return _this.options.force_update_answer(question.id, question.default_answer, diff_id);
              }
            };
          })(this), 0);
        }
        if (hide === this.get_diff_field(question, 'hidden', diff_id)) {
          return;
        }
        this.set_diff_field(question, 'hidden', diff_id, hide);
        validity = this.validate_answer(question, diff_id);
        delta = hide ? -1 : 1;
        if (question.is_mandatory || (!question.is_mandatory && this.get_diff_field(question, 'in_denom', diff_id))) {
          this.set_diff_field(section, 'cond_decom', diff_id, this.get_diff_field(section, 'cond_decom', diff_id) + delta);
          if (validity) {
            this.set_diff_field(section, 'num', diff_id, this.get_diff_field(section, 'num', diff_id) + delta);
          }
          this.section_update_progress(section);
        }
        if (this.options && this.options.update_visibility) {
          return this.options.update_visibility(section.step_id, section.id, question.id, diff_id, hide);
        }
      };

      RentalAgreementUtil.prototype.section_update_progress = function(section) {
        if (!section) {
          return;
        }
        this.step_update_progress(section.step_id);
        return section.update_progress();
      };

      RentalAgreementUtil.prototype.section_update_progress_gen = function() {
        var diff_id, k, len, ref, results;
        if (Housing.RentalAgreement && Housing.RentalAgreement.options && Housing.RentalAgreement.options.section_update_progress) {
          if (this.is_repeatable) {
            ref = this.diffs;
            results = [];
            for (k = 0, len = ref.length; k < len; k++) {
              diff_id = ref[k];
              results.push(Housing.RentalAgreement.options.section_update_progress(this.id, diff_id, this.num_diff[diff_id], this.basic_denom + this.cond_decom_diff[diff_id]));
            }
            return results;
          } else {
            return Housing.RentalAgreement.options.section_update_progress(this.id, null, this.num, this.basic_denom + this.cond_decom);
          }
        }
      };

      RentalAgreementUtil.prototype.step_update_progress = function(step_id) {
        var diff_id, index, insert_pos, k, l, len, len1, len2, m, ref, ref1, ref2, section, step, temp_step;
        step = this.get_step_details(step_id);
        if (!step) {
          return;
        }
        step.num = 0;
        step.denom = 0;
        ref = step.agreement_step_sections;
        for (k = 0, len = ref.length; k < len; k++) {
          section = ref[k];
          if (section.is_repeatable) {
            ref1 = section.diffs;
            for (l = 0, len1 = ref1.length; l < len1; l++) {
              diff_id = ref1[l];
              step.num += section.num_diff[diff_id];
              step.denom += section.basic_denom + section.cond_decom_diff[diff_id];
            }
          } else {
            step.num += section.num;
            step.denom += section.basic_denom + section.cond_decom;
          }
        }
        if (this.is_incomplete == null) {
          this.is_incomplete = true;
        }
        if (step.num === step.denom) {
          index = this.incomplete_steps.indexOf(step.id);
          if (-1 !== index) {
            this.incomplete_steps.splice(index, 1);
          }
        } else {
          if (-1 === this.incomplete_steps.indexOf(step.id)) {
            this.incomplete_steps.push(step.id);
            insert_pos = 0;
            ref2 = this.sorted_steps;
            for (m = 0, len2 = ref2.length; m < len2; m++) {
              temp_step = ref2[m];
              if (this.incomplete_steps[insert_pos] === temp_step.id) {
                insert_pos++;
              }
              if (step.id === temp_step.id && -1 === this.incomplete_steps.indexOf(step.id)) {
                this.incomplete_steps.splice(insert_pos, 0, step.id);
                break;
              }
            }
          }
        }
        if (!this.incomplete_steps.length) {
          if (this.is_incomplete) {
            if (this.options) {
              this.options.rental_agreement_complete();
            }
            this.is_incomplete = false;
          }
          hlog('Everything Green, show review bar or whatever Prateek says');
        } else {
          if (!this.is_incomplete) {
            this.is_incomplete = true;
            if (this.options) {
              this.options.rental_agreement_incomplete();
            }
          }
        }
        return step.update_progress();
      };

      RentalAgreementUtil.prototype.step_update_progress_gen = function() {
        if (Housing.RentalAgreement && Housing.RentalAgreement.options && Housing.RentalAgreement.options.step_update_progress) {
          return Housing.RentalAgreement.options.step_update_progress(this.id, this.num, this.denom);
        }
      };

      RentalAgreementUtil.prototype.next_incomplete_question = function(step_id, section_id, diff_id, question_id) {
        var diff_pos, next_found, question, question_pos, section, section_pos, step, step_pos;
        if (!this.incomplete_steps.length) {
          return;
        }
        if (step_id && section_id && question_id) {
          step = this.get_step_details(step_id);
          step_pos = this.sorted_steps.indexOf(step);
          section = this.get_section_details(section_id);
          section_pos = step.agreement_step_sections.indexOf(section);
          question = this.questions[question_id];
          question_pos = section.agreement_step_section_questions.indexOf(question);
          question_pos++;
          if (diff_id) {
            diff_pos = section.diffs.indexOf(diff_id);
          }
        } else {
          step_pos = 0;
          section_pos = 0;
          question_pos = 0;
          diff_pos = 0;
        }
        next_found = false;
        while (!next_found) {
          while (step_pos < this.sorted_steps.length) {
            step = this.sorted_steps[step_pos];
            while (section_pos < step.agreement_step_sections.length) {
              section = step.agreement_step_sections[section_pos];
              if (section.is_repeatable) {
                while (diff_pos < section.diffs.length) {
                  if (this.section_incomplete_question(section, section.diffs[diff_pos], question_pos)) {
                    return;
                  }
                  diff_pos++;
                  question_pos = 0;
                }
              } else {
                if (this.section_incomplete_question(section, null, question_pos)) {
                  return;
                }
              }
              section_pos++;
              question_pos = 0;
              diff_pos = 0;
            }
            step_pos++;
            section_pos = 0;
          }
          step_pos = 0;
        }
      };

      RentalAgreementUtil.prototype.section_incomplete_question = function(section, diff_id, question_pos) {
        var is_hidden, question;
        if (!(this.get_diff_field(section, 'num', diff_id) < this.get_diff_field(section, 'basic_denom', diff_id) + this.get_diff_field(section, 'cond_decom', diff_id))) {
          return false;
        }
        while (question_pos < section.agreement_step_section_questions.length) {
          question = section.agreement_step_section_questions[question_pos];
          is_hidden = this.get_diff_field(question, 'hidden', diff_id);
          if ((!is_hidden) && (!this.validate_answer(question, diff_id))) {
            setTimeout((function(_this) {
              return function() {
                var step;
                console.log(section.step_id, section.id, diff_id, question.id);
                step = _this.get_step_details(section.step_id);
                _this.options.step_change(step, 'incomplete');
                return _this.options.focus_question(section.id, diff_id, question.id);
              };
            })(this), 0);
            return true;
          }
          question_pos++;
        }
        return false;
      };

      RentalAgreementUtil.prototype.union = function(arr1, arr2) {
        var i, j, out;
        i = 0;
        j = 0;
        out = [];
        while (i < arr1.length && j < arr2.length) {
          if (arr1[i] === arr2[j]) {
            out.push(arr1[i]);
            i++;
            j++;
          } else if (arr1[i] < arr2[j]) {
            out.push(arr1[i]);
            i++;
          } else {
            out.push(arr2[j]);
            j++;
          }
        }
        while (i < arr1.length) {
          out.push(arr1[i]);
          i++;
        }
        while (j < arr2.length) {
          out.push(arr2[j]);
          j++;
        }
        return out;
      };

      RentalAgreementUtil.prototype.get_step_details = function(step_id) {
        return this.steps[step_id];
      };

      RentalAgreementUtil.prototype.get_section_details = function(section_id) {
        return this.sections[section_id];
      };

      RentalAgreementUtil.prototype.get_diff_field = function(obj, field, diff_id) {
        if (diff_id) {
          if (obj[field + '_diff']) {
            return obj[field + '_diff'][diff_id];
          }
        }
        return obj[field];
      };

      RentalAgreementUtil.prototype.set_diff_field = function(obj, field, diff_id, value) {
        if (diff_id) {
          if (obj[field + '_diff']) {
            return obj[field + '_diff'][diff_id] = value;
          }
        }
        return obj[field] = value;
      };

      RentalAgreementUtil.prototype.step_change = function(step_id, mode) {
        var step;
        step = this.get_step_details(step_id);
        if (!step) {
          return;
        }
        return setTimeout((function(_this) {
          return function() {
            _this.options.step_change(step, mode);
            return _this.section_change(step.agreement_step_sections[0].id, (step.agreement_step_sections[0].is_repeatable ? step.agreement_step_sections[0].diffs[0] : null), 'step_change_' + mode);
          };
        })(this), 0);
      };

      RentalAgreementUtil.prototype.section_change = function(section_id, diff_id, mode) {
        var section;
        section = this.get_section_details(section_id);
        if (!section) {
          return;
        }
        return setTimeout((function(_this) {
          return function() {
            return _this.options.section_change(section, diff_id, mode);
          };
        })(this), 0);
      };

      RentalAgreementUtil.prototype.create_new_repeatable = function(section_id) {
        var i, k, l, len, len1, len2, logic, m, question, ref, ref1, ref2, section;
        section = this.get_section_details(section_id);
        if (!section) {
          return false;
        }
        if (section.diffs.length >= this.MAX_REPEATABLE) {
          return;
        }
        i = 1;
        while (i <= section.diffs.length) {
          if (i === section.diffs[i - 1]) {
            i++;
          } else {
            break;
          }
        }
        section.diffs.splice(i - 1, 0, i);
        section.cond_decom_diff[i] = 0;
        section.num_diff[i] = 0;
        ref = section.agreement_step_section_questions;
        for (k = 0, len = ref.length; k < len; k++) {
          question = ref[k];
          question.answer_diff[i] = question.default_answer;
          if (!question.is_mandatory) {
            question.in_denom_diff[i] = false;
          }
          if (question.logics.length) {
            question.hidden_diff[i] = true;
            ref1 = question.logics;
            for (l = 0, len1 = ref1.length; l < len1; l++) {
              logic = ref1[l];
              logic.hidden_diff[i] = true;
            }
          }
        }
        ref2 = section.agreement_step_section_questions;
        for (m = 0, len2 = ref2.length; m < len2; m++) {
          question = ref2[m];
          this.update_slaves(question, i);
        }
        this.section_update_progress(section);
        return setTimeout((function(_this) {
          return function() {
            _this.options.create_new_repeatable(section, i);
            return _this.section_change(section_id, i, 'add_person');
          };
        })(this), 0);
      };

      RentalAgreementUtil.prototype.delete_repeatable = function(section_id, diff_id) {
        var index, k, l, len, len1, logic, question, ref, ref1, section;
        section = this.get_section_details(section_id);
        if (!(section && section.is_repeatable && section.diffs)) {
          return;
        }
        index = section.diffs.indexOf(diff_id);
        if (index >= 0 && section.diffs.length > 1) {
          section.diffs.splice(index, 1);
          ref = section.agreement_step_section_questions;
          for (k = 0, len = ref.length; k < len; k++) {
            question = ref[k];
            question.answer_diff[diff_id] = null;
            if (!question.is_mandatory) {
              question.in_denom_diff[diff_id] = null;
            }
            if (question.logics.length) {
              if (question.hidden_diff) {
                question.hidden_diff[diff_id] = null;
              }
              ref1 = question.logics;
              for (l = 0, len1 = ref1.length; l < len1; l++) {
                logic = ref1[l];
                logic.hidden_diff[diff_id] = null;
              }
            }
            if (this.unsaved_answers[question.id] && this.unsaved_answers[question.id][diff_id]) {
              this.unsaved_answers[question.id][diff_id] = null;
            }
          }
          section.cond_decom_diff[diff_id] = 0;
          this.section_update_progress(section);
          return setTimeout((function(_this) {
            return function() {
              return _this.options.delete_repeatable(section, diff_id);
            };
          })(this), 0);
        }
      };

      RentalAgreementUtil.prototype.update_repeatable_title_gen = function() {
        var section_id, step_id;
        step_id = this.id;
        section_id = this.agreement_step_sections[0].id;
        return setTimeout(function() {
          return Housing.RentalAgreement.options.update_repeatable_title(step_id, section_id);
        }, 0);
      };

      RentalAgreementUtil.prototype.show_optional_clause = function(section_id, show) {
        var k, len, question, ref, section;
        if (show == null) {
          show = true;
        }
        section = this.get_section_details(section_id);
        if (!section) {
          return;
        }
        section.optional_shown = show;
        if (!show) {
          ref = section.agreement_step_section_questions;
          for (k = 0, len = ref.length; k < len; k++) {
            question = ref[k];
            if (question.answer !== question.default_answer) {
              this.set_answer(question.id, question.default_answer || '', null, false, true);
            }
          }
        }
        return setTimeout((function(_this) {
          return function() {
            if (_this.options && _this.options.show_optional_clause) {
              return _this.options.show_optional_clause(section, show);
            }
          };
        })(this), 0);
      };

      RentalAgreementUtil.prototype.compute_optional = function(question, clauses) {
        var clause, k, l, len, len1, old_clauses, ref, ref1, results;
        old_clauses = this.get_diff_field(question, 'answer');
        old_clauses = old_clauses ? JSON.parse(old_clauses) : [];
        ref = _.difference(clauses, old_clauses);
        for (k = 0, len = ref.length; k < len; k++) {
          clause = ref[k];
          this.show_optional_clause(clause, true);
        }
        ref1 = _.difference(old_clauses, clauses);
        results = [];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          clause = ref1[l];
          results.push(this.show_optional_clause(clause, false));
        }
        return results;
      };

      RentalAgreementUtil.prototype.validate_answer = function(question, diff_id) {
        var answer, pattern, valid;
        answer = this.get_diff_field(question, 'answer', diff_id);
        valid = true;
        if (question.is_mandatory && !answer) {
          valid = false;
        }
        if (question.regex && answer) {
          pattern = new RegExp(question.regex, 'g');
          valid = pattern.test(answer);
        }
        return valid;
      };

      RentalAgreementUtil.prototype.set_answer = function(ques_id, answer, diff_id, dont_push, dont_show_preview) {
        var current_tag, delta, is_hidden, new_validity, old_validity, question, section, share_tags, step;
        question = this.questions[ques_id];
        if (!question) {
          return;
        }
        if (question.tag === 'Choose-Optional') {
          this.compute_optional(question, JSON.parse(answer));
        }
        share_tags = /share_(.*?)_(.*)/.exec(question.tag);
        if (share_tags && share_tags.length) {
          current_tag = this.tag[share_tags[1]];
          this.share_contacts[current_tag][diff_id] || (this.share_contacts[current_tag][diff_id] = {});
          this.share_contacts[current_tag][diff_id][question.tag] = answer;
        }
        section = this.get_section_details(question.section_id);
        if (!section) {
          return;
        }
        old_validity = this.validate_answer(question, diff_id);
        this.set_diff_field(question, 'answer', diff_id, answer);
        new_validity = this.validate_answer(question, diff_id);
        is_hidden = this.get_diff_field(question, 'hidden', diff_id);
        if (!question.is_mandatory && answer && !(this.get_diff_field(question, 'in_denom', diff_id))) {
          this.set_diff_field(question, 'in_denom', diff_id, true);
          if (!is_hidden) {
            this.set_diff_field(section, 'cond_decom', diff_id, this.get_diff_field(section, 'cond_decom', diff_id) + 1);
            if (new_validity) {
              this.set_diff_field(section, 'num', diff_id, this.get_diff_field(section, 'num', diff_id) + 1);
            }
            this.section_update_progress(section);
          }
        } else if (!question.is_mandatory && !answer && (this.get_diff_field(question, 'in_denom', diff_id))) {
          this.set_diff_field(question, 'in_denom', diff_id, false);
          if (!is_hidden) {
            this.set_diff_field(section, 'cond_decom', diff_id, this.get_diff_field(section, 'cond_decom', diff_id) - 1);
            if (old_validity) {
              this.set_diff_field(section, 'num', diff_id, this.get_diff_field(section, 'num', diff_id) - 1);
            }
            this.section_update_progress(section);
          }
        } else if (old_validity !== new_validity) {
          if (question.default_answer && (answer !== question.default_answer) && (!this.get_diff_field(question, 'in_denom', diff_id))) {
            this.set_diff_field(question, 'in_denom', diff_id, true);
            if (!is_hidden) {
              this.set_diff_field(section, 'cond_decom', diff_id, this.get_diff_field(section, 'cond_decom', diff_id) + 1);
              if (old_validity) {
                this.set_diff_field(section, 'num', diff_id, this.get_diff_field(section, 'num', diff_id) + 1);
              }
            }
          }
          if (!is_hidden) {
            delta = new_validity ? 1 : -1;
            this.set_diff_field(section, 'num', diff_id, this.get_diff_field(section, 'num', diff_id) + delta);
            this.section_update_progress(section);
          }
        }
        this.update_slaves(question, diff_id);
        if (question.fee_type) {
          this.sdr_fields[question.fee_type] = parseInt(answer);
        }
        if (question.fee_type) {
          this.update_sdr();
        }
        if (dont_push) {
          return;
        }
        if (section.is_repeatable && diff_id) {
          if (!this.unsaved_answers[question.id]) {
            this.unsaved_answers[question.id] = {};
          }
          this.unsaved_answers[question.id][diff_id] = answer;
          if (0 === section.agreement_step_section_questions.indexOf(question)) {
            step = this.get_step_details(section.step_id);
            if (!step.update_repeatable_title) {
              step.update_repeatable_title = _.debounce(this.update_repeatable_title_gen, 1000);
            }
            step.update_repeatable_title();
          }
        } else {
          this.unsaved_answers[question.id] = answer;
        }
        this.last_step = section.step_id;
        this.last_section = section.id;
        this.last_diff = diff_id;
        this.last_question = ques_id;
        return setTimeout((function(_this) {
          return function() {
            return _this.options.set_answer(section.id, diff_id, question, dont_show_preview);
          };
        })(this), 0);
      };

      RentalAgreementUtil.prototype.update_sdr_gen = function() {
        var field, incomplete_fields, ref, value;
        if (this.destroyed || _.isEqual(this.prev_sdr_fields, this.sdr_fields)) {
          return;
        }
        ref = this.sdr_fields;
        for (field in ref) {
          if (!hasProp.call(ref, field)) continue;
          value = ref[field];
          if (value === void 0) {
            incomplete_fields = true;
            break;
          }
        }
        if (this.city_max_duration < parseInt(this.sdr_fields.duration_months)) {
          this.sdr_values = {
            large_duration: true
          };
          this.options && this.options.update_sdr();
          return;
        }
        if (!incomplete_fields) {
          this.prev_sdr_fields = _.clone(this.sdr_fields);
          if (this.ra_fees_model) {
            return this.ra_fees_model.sanitized_set(this.sdr_fields);
          } else {
            return this.options && this.options.set_sdr_loading();
          }
        } else {
          this.sdr_values = void 0;
          return this.options && this.options.update_sdr();
        }
      };

      RentalAgreementUtil.prototype.destroy = function() {
        var ref;
        this.destroyed = true;
        this.share_agreement_xhr = null;
        return (ref = this.ra_fees_model) != null ? ref.destroy() : void 0;
      };

      return RentalAgreementUtil;

    })();
    return RentalAgreementUtil;
  });

}).call(this);

(function() {
  if (window.JST == null) {
    window.JST = {};
  }

  window.JST['rental_agreements/edit_view'] = function(context) {
    return (function() {
      var $o;
      $o = [];
      $o.push("<div id='ra-edit'>\n<div class='hidden review-agreement-bar review-bar'>\n<div class='review-header'>\nAgreement Ready For Review\n</div>\n<div class='review-subheader'>\nExplore Additional Clauses or Review Agreement\n</div>\n<div class='btn review-agreement-btn review-btn secondary'>\n<icon class='icon-thin-tick'></icon>\nReview Agreement\n</div>\n</div>\n<div class='finish-bar hidden review-agreement-bar'>\n<div class='review-header'>\nAgreement Incomplete\n</div>\n<div class='review-subheader'>\nSome questions are incomplete, please complete them.\n</div>\n<div class='btn finish-btn primary review-agreement-btn'>\nNext Question\n</div>\n</div>\n<div id='ra-form-wrap'>\n<div id='ra-form'></div>\n</div>\n<div id='ra-preview'>\n<div class='bottom-section hidden'>\n<div class='edit-view'>< BACK TO EDIT</div>\n<div class='btn primary show-share-view'>\n<i class='icon-thin-tick'></i>\nDOWNLOAD PDF\n</div>\n</div>\n</div>\n<div id='ra-sidebar'></div>\n</div>\n<div class='collapsed' id='share'></div>");
      return $o.join("\n").replace(/\s(?:id|class)=(['"])(\1)/mg, "");
    }).call(window.HAML.context(context));
  };

}).call(this);

define("backbone/templates/rental_agreements/_edit_view", function(){});

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define('backbone/views/rental_agreements/edit_view',['backbone/assets', 'backbone/views/rental_agreements/preview', 'backbone/views/rental_agreements/form_view', 'backbone/views/rental_agreements/sidebar_view', 'backbone/helpers/rental_agreements/rental_agreements_utils', 'backbone/templates/rental_agreements/_edit_view'], function(Housing, Preview, FormView, SideBar, RentalAgreementUtil) {
    var EditView;
    return EditView = (function(superClass) {
      extend(EditView, superClass);

      function EditView() {
        this.destroy = bind(this.destroy, this);
        this.show_completed_bar = bind(this.show_completed_bar, this);
        this.completed_rental_agreement = bind(this.completed_rental_agreement, this);
        this.incomplete_rental_agreement = bind(this.incomplete_rental_agreement, this);
        this.show_optional_clause = bind(this.show_optional_clause, this);
        this.delete_repeatable = bind(this.delete_repeatable, this);
        this.create_new_repeatable = bind(this.create_new_repeatable, this);
        this.update_repeatable_title = bind(this.update_repeatable_title, this);
        this.step_update_progress = bind(this.step_update_progress, this);
        this.focus_question = bind(this.focus_question, this);
        this.section_change = bind(this.section_change, this);
        this.step_change = bind(this.step_change, this);
        this.download_pdf = bind(this.download_pdf, this);
        this.back_to_agreement = bind(this.back_to_agreement, this);
        this.review_agreement = bind(this.review_agreement, this);
        this.finish_incomplete = bind(this.finish_incomplete, this);
        this.show_edit_view = bind(this.show_edit_view, this);
        this.hide_bar_from_view = bind(this.hide_bar_from_view, this);
        this.completed_bar_scroll_gen = bind(this.completed_bar_scroll_gen, this);
        this.scroll_event = bind(this.scroll_event, this);
        this._render = bind(this._render, this);
        this.render = bind(this.render, this);
        this.initialize = bind(this.initialize, this);
        return EditView.__super__.constructor.apply(this, arguments);
      }

      EditView.prototype.el = '#main-content';

      EditView.prototype.template = {
        main: window.JST['rental_agreements/edit_view']
      };

      EditView.prototype.events = {
        'click .edit-view': 'show_edit_view',
        'click .show-share-view:not(.rental-loading-btn)': 'download_pdf',
        'click .review-btn': 'review_agreement',
        'click .finish-btn': 'finish_incomplete',
        'click .cs-agreement': 'back_to_agreement'
      };

      EditView.prototype.initialize = function() {
        this.pageYOffset = 0;
        this.render();
        if (Housing.agreements) {
          return Housing.agreements = null;
        }
      };

      EditView.prototype.render = function() {
        if (!$('#ra-edit').length) {
          this.$el.append(this.template.main());
        }
        this.$ra_edit = this.$el.find('#ra-edit');
        if (Housing.RentalAgreement) {
          Housing.RentalAgreement.destroy();
        }
        return Housing.RentalAgreement = new RentalAgreementUtil(this._render);
      };

      EditView.prototype.trigger_index_view = function() {
        return $('body').removeClass('loading');
      };

      EditView.prototype._render = function(status) {
        this.show_edit_view();
        return this.trigger_index_view();
      };

      EditView.prototype.scroll_event = function(e) {
        var scrollTop;
        scrollTop = window.pageYOffset;
        this.sidebar.float_side(e, scrollTop);
        this.formview.scroll_event(e, scrollTop);
        if (!this.completed_bar_scroll) {
          this.completed_bar_scroll = _.debounce(this.completed_bar_scroll_gen, 200);
        }
        return this.completed_bar_scroll();
      };

      EditView.prototype.completed_bar_scroll_gen = function() {
        if (this.destroyed) {
          return;
        }
        if (this.$ra_edit.hasClass('rental_agreement_completed')) {
          return this.hide_bar_from_view('.review-bar');
        } else if (this.formview.show_incomplete_bar) {
          return this.hide_bar_from_view('.finish-bar');
        }
      };

      EditView.prototype.hide_bar_from_view = function(bar_class) {
        var $bar, $feedback_form;
        $feedback_form = this.$el.find('#ra-form-wrap .form-feedback');
        $bar = this.$el.find(bar_class);
        if ($feedback_form.length && window.innerHeight > $feedback_form.get(0).getBoundingClientRect().top) {
          return $bar.addClass('hidden');
        } else {
          return $bar.removeClass('hidden');
        }
      };

      EditView.prototype.show_edit_view = function() {
        if (!this.sidebar) {
          this.sidebar = new SideBar();
          this.formview = new FormView();
          this.preview = new Preview();
          Housing.RentalAgreement.init_callbacks({
            step_change: this.step_change,
            section_change: this.section_change,
            focus_question: this.focus_question,
            set_answer: this.preview.set_answer,
            update_visibility: this.formview.update_visibility,
            force_update_answer: this.formview.force_update_answer,
            section_update_progress: this.sidebar.section_update_progress,
            step_update_progress: this.step_update_progress,
            saving_answers: this.sidebar.saving_answers,
            answer_save_sucess: this.sidebar.answer_save_sucess,
            answer_save_fail: this.sidebar.answer_save_fail,
            update_repeatable_title: this.update_repeatable_title,
            create_new_repeatable: this.create_new_repeatable,
            delete_repeatable: this.delete_repeatable,
            rental_agreement_complete: this.completed_rental_agreement,
            rental_agreement_incomplete: this.incomplete_rental_agreement,
            show_optional_clause: this.show_optional_clause,
            set_sdr_loading: this.formview.load_sdr,
            update_sdr: this.formview.update_sdr
          });
          this.last = {
            step: null,
            section: null,
            diff_id: null
          };
        }
        if (Housing.RentalAgreement.incomplete_steps.length) {
          this.incomplete_rental_agreement();
        } else {
          this.completed_rental_agreement();
        }
        this.listenTo($(window), 'scroll', this.scroll_event);
        this.$ra_edit.removeClass('rental_agreement_preview');
        this.preview.$el.find('.ra-preview-inner').addClass('fixed-mode');
        return this.$ra_edit.find('.bottom-section').addClass('hidden');
      };

      EditView.prototype.finish_incomplete = function(e) {
        if (this.formview) {
          return this.formview.goto_incomplete_question(e, true);
        }
      };

      EditView.prototype.review_agreement = function(e) {
        this.$ra_edit.addClass('rental_agreement_preview');
        this.preview.$el.find('.ra-preview-inner').removeClass('fixed-mode').removeAttr('style');
        this.$el.find('.bottom-section').removeClass('hidden');
        return $('html,body').animate({
          scrollTop: 0
        }, 200);
      };

      EditView.prototype.back_to_agreement = function(e) {
        $('#ra-edit').removeClass('collapsed');
        this.share_view.$el.addClass('collapsed').removeClass('share-view');
        Housing.Track.track_gaq_event('ra_review_agreement', 'back_agreement');
        if (this.preview) {
          $('html,body').animate({
            scrollTop: 0
          }, 200);
          return Housing.RentalAgreement.clear_download_interval();
        } else {
          return this.show_edit_view();
        }
      };

      EditView.prototype.download_pdf = function(e) {
        this.$complete_btn = $(e.currentTarget).addClass('rental-loading-btn');
        return alert('Download PDF Feature has not yet been developed.');
      };

      EditView.prototype.step_change = function(step, mode) {
        this.sidebar.step_change(step.id);
        this.formview.step_change(step.id);
        return this.last_step = step;
      };

      EditView.prototype.section_change = function(section, diff_id, mode) {
        var fields, from_section;
        this.sidebar.section_change(section.id, diff_id);
        this.formview.section_change(section.id, diff_id);
        fields = {};
        from_section = '';
        if (this.last_section) {
          this.prev_section = this.last_section;
          this.prev_diff_id = this.last_diff_id;
        }
        this.last_section = section;
        return this.last_diff_id = diff_id;
      };

      EditView.prototype.focus_question = function(section_id, diff_id, question_id) {
        return this.formview.focus_question(section_id, diff_id, question_id);
      };

      EditView.prototype.step_update_progress = function(step_id, num, denom) {
        this.sidebar.step_update_progress(step_id, num, denom);
        return this.formview.step_update_progress(step_id, num, denom);
      };

      EditView.prototype.update_repeatable_title = function(step_id, section_id) {
        return this.sidebar.update_repeatable_title(step_id, section_id);
      };

      EditView.prototype.create_new_repeatable = function(section, diff_id) {
        this.sidebar.create_new_repeatable(section.id, diff_id);
        this.formview.create_new_repeatable(section.id, diff_id);
        return this.preview.create_new_repeatable(section.id, diff_id);
      };

      EditView.prototype.delete_repeatable = function(section, diff_id) {
        this.sidebar.delete_repeatable(section.id, diff_id);
        this.formview.delete_repeatable(section.id, diff_id);
        this.preview.delete_repeatable(section.id, diff_id);
        if (this.last_section === section.id && ((!this.last_diff_id) || (this.last_diff_id === diff_id))) {
          this.last_section = null;
          return this.last_diff_id = null;
        } else {
          return this.section_change(this.prev_section, this.prev_diff_id, 'remove_person');
        }
      };

      EditView.prototype.show_optional_clause = function(section, show) {
        var selection;
        this.sidebar.show_optional_clause(section.id, show);
        this.formview.show_optional_clause(section.id, show);
        selection = '';
        if (section.name) {
          return selection = section.name.split(' ')[0];
        }
      };

      EditView.prototype.incomplete_rental_agreement = function() {
        this.$ra_edit.removeClass('rental_agreement_preview');
        this.$ra_edit.removeClass('rental_agreement_completed');
        return this.$el.find('.review-bar').addClass('hidden');
      };

      EditView.prototype.completed_rental_agreement = function() {
        var $feedback_form;
        $feedback_form = this.$el.find('#ra-form-wrap .form-feedback');
        if ($feedback_form.length && $feedback_form.offset().top > $(window).scrollTop() + $(window).height()) {
          this.show_completed_bar();
        }
        return this.$ra_edit.addClass('rental_agreement_completed');
      };

      EditView.prototype.show_completed_bar = function() {
        return this.$el.find('.review-bar').removeClass('hidden');
      };

      EditView.prototype.destroy = function() {
        this.destroyed = true;
        if (Housing.RentalAgreement) {
          Housing.RentalAgreement.destroy();
        }
        Housing.RentalAgreement = null;
        if (this.preview) {
          this.preview.destroy();
        }
        if (this.sidebar) {
          this.sidebar.destroy();
        }
        if (this.formview) {
          this.formview.destroy();
        }
        if (this.share_view) {
          this.share_view.destroy();
        }
        this.stopListening();
        return this.$el.off().empty();
      };

      return EditView;

    })(Backbone.View);
  });

}).call(this);

(function() {
  define('backbone/helpers/housing_log',['backbone/assets'], function(Housing) {
    var e, error, isIE;
    isIE = (function() {
      var div;
      div = document.createElement("div");
      div.innerHTML = "<!--[if IE]><i></i><![endif]-->";
      return div.getElementsByTagName("i").length === 1;
    })();
    window.hlog = function() {};
    window.hnow = function() {};
    window.herr = function() {};
    window.hwarn = function() {};
    if (!window.console) {
      window.console = {
        log: function() {}
      };
    }
    if (window.debug_mode === true || Housing.env === 'development') {
      if (!isIE) {
        try {
          window.hlog = console.log.bind(console);
          window.hnow = console.log.bind(console, '%c NOW ---> ', 'background: green; font-size: 16px; color: white');
          window.herr = console.error.bind(console);
          window.hwarn = console.warn.bind(console);
        } catch (error) {
          e = error;
          window.hlog = function() {};
          window.hnow = function() {};
          window.herr = function() {};
          window.hwarn = function() {};
        }
      }
      return {};
    }
  });

}).call(this);

(function() {
  require(['libraries', 'backbone/assets', 'templates/context', 'backbone/views/rental_agreements/edit_view', 'backbone/helpers/housing_log'], function(libs, Housing, Context, IndexView) {
    String.prototype.capitalize = function() {
      return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    };
    return new IndexView();
  });

}).call(this);

define("backbone/application", function(){});
