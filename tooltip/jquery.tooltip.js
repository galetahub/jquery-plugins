(function() {
  var $, ToolTip;

  $ = jQuery;

  $.fn.extend({
    tooltip: function(options) {
      return $(this).each(function(input_field) {
        var tooltip;
        tooltip = $(this).data("tooltip");
        if (tooltip == null) {
          tooltip = new ToolTip(this, options);
        }
        return tooltip;
      });
    }
  });

  ToolTip = (function() {

    function ToolTip(dom_element, options) {
      var defaults;
      this.dom_element = dom_element;
      if (options == null) {
        options = {};
      }
      defaults = {
        activation: "hover",
        keepAlive: false,
        edgeOffset: 3,
        position: "bottom",
        delay: 400,
        fadeIn: 200,
        fadeOut: 200,
        attribute: "title",
        content: false,
        container_id: "tt-container"
      };
      this.options = $.extend(defaults, options);
      this._setup();
      this._register_observers();
    }

    ToolTip.prototype._setup = function() {
      var text;
      this.element = $(this.dom_element);
      this.element.addClass("tt-done");
      text = this.element.attr(this.options.attribute);
      this.element.data('tt-text', text);
      this.element.data('tooltip', this);
      this.element.removeAttr(this.options.attribute);
      this.container = this._create_container(this.options.container_id);
      return this.container.hide();
    };

    ToolTip.prototype._create_container = function(dom_id) {
      var container, content, holder;
      if (dom_id == null) {
        dom_id = 'tt-container';
      }
      container = $('#' + dom_id);
      if (container.length === 0) {
        holder = $('<div></div>', {
          "class": "black-note",
          id: dom_id
        });
        content = $('<div class="note-holder"></div>');
        ($("body")).append(holder.html(content));
        return holder;
      } else {
        return container;
      }
    };

    ToolTip.prototype._register_observers = function() {
      var _this = this;
      return this.element.bind(this.options.activation, function(evt) {
        return _this.activate(evt);
      });
    };

    ToolTip.prototype.activate = function(event) {
      if (this.element.hasClass('tt-active')) {
        return this.hide(event);
      } else {
        return this.show(event);
      }
    };

    ToolTip.prototype.show = function(event) {
      var pos, text,
        _this = this;
      text = this.element.data('tt-text');
      this.container.find('div.note-holder').html(text);
      pos = this._position();
      this.container.css({
        position: "absolute",
        left: pos.left + "px",
        top: pos.top + "px",
        zIndex: 1001
      });
      this.element.addClass("tt-active");
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      return this.timeout = setTimeout((function() {
        return _this.fadeIn();
      }), this.options.delay);
    };

    ToolTip.prototype.fadeIn = function() {
      return this.container.stop(true, true).fadeIn(this.options.fadeIn);
    };

    ToolTip.prototype.hide = function(event) {
      this.element.removeClass("tt-active");
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      return this.container.fadeOut(this.options.fadeOut);
    };

    ToolTip.prototype._position = function() {
      var el_height, el_width, height, pos, target, width;
      width = this.container.outerWidth();
      height = this.container.outerHeight();
      el_width = this.element.outerWidth();
      el_height = this.element.outerHeight();
      target = this.element.css('position') === 'absolute' ? this.element.parents('div') : this.element;
      pos = target.offset();
      return {
        left: pos.left - width / 2 + el_width / 2,
        top: pos.top + el_height + 7
      };
    };

    return ToolTip;

  })();

}).call(this);
