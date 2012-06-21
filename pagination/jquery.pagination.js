(function() {
  var $, Pagination;

  $ = jQuery;

  $.fn.extend({
    pagination: function(options) {
      if ($.browser.msie && ($.browser.version === "6.0" || $.browser.version === "7.0")) {
        return this;
      }
      return $(this).each(function(input_field) {
        var el;
        el = $(this).data('pagination');
        if (el == null) {
          el = new Pagination(this, options);
        }
        return el;
      });
    }
  });

  Pagination = (function() {

    function Pagination(dom_element, options) {
      var defaults;
      this.dom_element = dom_element;
      if (options == null) {
        options = {};
      }
      defaults = {
        page: 1,
        url: window.location.href,
        params: {},
        method: 'GET',
        dataType: 'html',
        binder: window,
        event: 'scroll',
        callback: null
      };
      this.options = $.extend(defaults, options);
      this._setup();
    }

    Pagination.prototype._setup = function() {
      this.container = $(this.dom_element);
      this.container.data('pagination', this);
      this.current_page = this.options.page;
      this.disabled = false;
      this.root = this.container.parent();
      this.origin_url = window.location.href.split('#')[0];
      this.binder = $(this.options.binder);
      return this._bind();
    };

    Pagination.prototype._bind = function() {
      var _this = this;
      switch (this.options.event) {
        case 'scroll':
          return this.binder.bind('scroll', function(e) {
            return _this.scroll(e);
          });
        case 'click':
          return this.binder.bind('click', function(e) {
            return _this.click(e);
          });
      }
    };

    Pagination.prototype.load = function() {
      var _this = this;
      this.current_page += 1;
      this.disabled = true;
      this.options.params["time"] = new Date().getTime();
      return $.ajax({
        url: this.options.url + "/p/" + this.current_page,
        type: this.options.method,
        data: this.options.params,
        dataType: this.options.dataType,
        success: function(data, status, xhr) {
          _this.append(data);
          return _this.disabled = false;
        }
      });
    };

    Pagination.prototype.append = function(data) {
      var items;
      if ($.isFunction(this.options.callback)) {
        this.options.callback.apply(this, [data]);
      } else {
        items = $(data).find('#' + this.container.attr('id'));
        this.container.append(items.html());
      }
      return window.location.href = this.origin_url + "#/p/" + this.current_page;
    };

    Pagination.prototype.scroll = function(event) {
      var pixelsFromNavToBottom, pixelsFromWindowBottomToBottom;
      if (this.disabled) {
        event.stopPropagation();
      } else {
        pixelsFromWindowBottomToBottom = 0 + $(document).height() - this.binder.scrollTop() - $(window).height();
        pixelsFromNavToBottom = $(document).height() - (this.root.offset().top + this.root.height());
        if (pixelsFromWindowBottomToBottom - pixelsFromNavToBottom <= 0) {
          this.load();
        }
      }
      return true;
    };

    Pagination.prototype.click = function(event) {
      this.load();
      return false;
    };

    return Pagination;

  })();

}).call(this);
