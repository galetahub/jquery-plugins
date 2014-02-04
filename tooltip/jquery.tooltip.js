(function($) {

  $.textMetrics = function(el) {

    var h = 0, w = 0;

    var div = document.createElement('div');
    document.body.appendChild(div);
    $(div).css({
      position: 'absolute',
      left: -1000,
      top: -1000,
      display: 'none'
    });

    $(div).html($(el).html());
    var styles = ['font-size','font-style', 'font-weight', 'font-family','line-height', 'text-transform', 'letter-spacing'];
    $(styles).each(function() {
      var s = this.toString();
      $(div).css(s, $(el).css(s));
    });

    h = $(div).outerHeight();
    w = $(div).outerWidth();

    $(div).remove();

    return { height: h, width: w };
  }

})(jQuery);

(function() {
  var $, ToolTip, root;

  root = this;

  $ = jQuery;

  $.fn.extend({
    tooltip: function(options) {
      if ($.browser.msie && ($.browser.version === "6.0" || $.browser.version === "7.0")) {
        return this;
      }
      return $(this).each(function(input_field) {
        if (!($(this)).hasClass("tt-done")) return new ToolTip(this, options);
      });
    }
  });

  ToolTip = (function() {

    function ToolTip(form_field, options) {
      var defaults;
      this.form_field = form_field;
      if (options == null) options = {};
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
        container_id: "tt-container",
        maxwidth: 350
      };
      this.options = $.extend(defaults, options);
      this.setup();
      this.register_observers();
    }

    ToolTip.prototype.setup = function() {
      var text;
      this.element = $(this.form_field);
      this.element.addClass("tt-done");
      text = this.element.attr(this.options.attribute);
      this.element.data('tt-text', text);
      this.element.removeAttr(this.options.attribute);
      this.container = this.create_container(this.options.container_id);
      this.text_holder = this.container.find('div.note-holder');
      this.pointer = this.container.find('span.tooltip-pointer');
      return this.container.hide();
    };

    ToolTip.prototype.create_container = function(dom_id) {
      var container, content, holder;
      if (dom_id == null) dom_id = 'tt-container';
      container = $('#' + dom_id);
      if (container.length === 0) {
        holder = $('<div></div>', {
          "class": "tooltip",
          id: dom_id
        });

        if (this.options.content)
          content = this.options.content;
        else
          content = $('<span class="tooltip-pointer"></span><div class="note-holder"></div>');

        ($("body")).append(holder.html(content));
        return holder;
      } else {
        return container;
      }
    };

    ToolTip.prototype.register_observers = function() {
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
      var pos, text, metric, width,
        _this = this;
      
      text = this.element.data('tt-text');      
      this.text_holder.html(text);

      metric = $.textMetrics(this.text_holder);
      pos = this.position();
      width = metric.width > this.options.maxwidth ? this.options.maxwidth : metric.width;
      
      this.container.css({
        position: "absolute",
        left: pos.left + "px",
        top: pos.top + "px",
        width: width + "px",
        zIndex: 1001
      });
      this.element.addClass("tt-active");
      if (this.timeout) clearTimeout(this.timeout);
      return this.timeout = setTimeout((function() {
        return _this.fadeIn();
      }), this.options.delay);
    };

    ToolTip.prototype.fadeIn = function() {
      return this.container.stop(true, true).fadeIn(this.options.fadeIn);
    };

    ToolTip.prototype.hide = function(event) {
      this.element.removeClass("tt-active");
      if (this.timeout) clearTimeout(this.timeout);
      return this.container.stop(true, true).fadeOut(this.options.fadeOut);
    };

    ToolTip.prototype.position = function() {
      var el_height, el_width, height, pos, target, width, mode;
      width = this.container.outerWidth();
      height = this.container.outerHeight();
      el_width = this.element.outerWidth();
      el_height = this.element.outerHeight();
      target = this.element.css('position') === 'absolute' ? this.element.parents('div') : this.element;
      pos = target.offset();
      mode = this.options.position;
      
      if (mode == 'leftright') {
        mode = ((width + pos.left + 200) > $(window).width() ? "right" : "left");
      }
      
      switch(mode) {
        case "left":
          pos = {
            left: pos.left + el_width + 10,
            top: pos.top + el_height / 2 - height / 2
          };
          this.pointer.removeClass('ttarr-right').addClass('ttarr-left');
          break;
        case "right":
          pos = {
            left: pos.left - width - 10,
            top: pos.top + el_height / 2 - height / 2
          };
          this.pointer.removeClass('ttarr-left').addClass('ttarr-right');
          break;
        case "bottom":
          pos = {
            left: pos.left - width / 2 + el_width / 2,
            top: pos.top + el_height + 7
          };
          break;
        default:
      }
      
      return pos;
    };

    return ToolTip;

  })();

}).call(this);
