(function($, window) {
  // project default object
  var common = {
    Swiper: null,
    el    : {
      doc : $(document),
      win : $(window),
      body: null
    },
    selector: {
      body      : 'body',
      html      : 'html',
      bh        : 'body, html',
      header    : '#wrapper > header',
      footer    : 'footer',
      swiperWrap: '.swiperWrap',
      popupBtn  : '.layPopBtn',
      tab       : '[class^="tabType"]',
      datepicker: '.multiCalendar',
      dimmed    : '.dimmed',
      slider    : '.slider',
      sortable  : '.ui-sortable',
      tooltip   : '.btnTool'
    },
    setting: {
      device : null,
      browser: null
    },
    handler: {
      ready: function() {
        common.el.body = $(common.selector.body);
        common.Swiper = window.Swiper;

        var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기
        var device = null;
        var browser = null;
        //모바일 환경 체크
        if (varUA.indexOf('android') > -1) {
          device = 'android';
        } else if (
          varUA.indexOf('iphone') > -1 ||
          varUA.indexOf('ipad') > -1 ||
          varUA.indexOf('ipod') > -1
        ) {
          device = 'ios';
        } else {
          device = 'other';
        }
        common.setting.device = device;
        // 브라우저 체크
        if (varUA.indexOf('chrome') !== -1 || varUA.indexOf('crios') !== -1) {
          browser = 'Chrome';
        } else if (varUA.indexOf('opera') !== -1) {
          browser = 'Opera';
        } else if (varUA.indexOf('firefox') !== -1) {
          browser = 'Firefox';
        } else if (varUA.indexOf('safari') !== -1) {
          browser = 'Safari';
        }
        common.setting.browser = browser;

        //스와이프
        common.el.doc.find(common.selector.swiperWrap).each(function(idx, el) {
          mySwiper.init(el);
        });

        //팝업
        common.el.doc.find(common.selector.popupBtn).each(function(idx, el) {
          popup.init(el);
        });

        //헤더 영역
        common.el.doc.find(common.selector.header).each(function(idx, el) {
          header.init(el);
        });

        //탭
        common.el.doc.find(common.selector.tab).each(function(idx, el) {
          tab.init(el);
        });

        //툴팁
        common.el.doc.find(common.selector.tooltip).each(function(idx, el) {
          tooltip.init(el);
        });

        //달력
        common.el.doc.find(common.selector.datepicker).each(function(idx, el) {
          datepicker.init(el);
        });

        //슬라이더
        common.el.doc.find(common.selector.slider).each(function(idx, el) {
          slider.init(el);
        });

        //정렬
        common.el.doc.find(common.selector.sortable).each(function(idx, el) {
          sortable.init(el);
        });

        //기타
        etc.init();

        common.el.win.trigger('scroll');
        common.el.win.trigger('resize');
      },
      load: function() {}
    }
  };

  // window ready event
  // $(document).on('DOMContentLoaded', common.handler.ready);
  common.el.doc.ready(common.handler.ready);

  // window load event
  // string: single quotation
  common.el.win.on('load', common.handler.load);
  // common.el.win.load(common.handler.load);

  // 유틸
  var utils = {
    //스크롤 비활성화
    scrollDisabled: function() {
      var body = common.el.body;
      body.css({
        overflow : 'hidden',
        position : 'fixed',
        height   : '100%',
        width    : '100%',
        marginTop:
          parseInt(body.css('margin-top')) || -common.el.win.scrollTop()
      });
    },
    //스크롤 활성화
    scrollEnabled: function() {
      var body = common.el.body;
      var scrollTop = -parseInt(body.css('margin-top'));
      body.css({
        overflow : '',
        position : '',
        height   : '',
        width    : '',
        marginTop: ''
      });
      common.el.win.scrollTop(scrollTop);
    },
    //딤 show
    dimmedShow: function() {
      var dimmed = $(common.selector.dimmed);
      var maxIndex = 0;
      common.el.doc.find('.layPop:visible').each(function() {
        var $this = $(this);
        var zIndex = parseInt($this.css('z-index'));
        maxIndex = maxIndex < zIndex ? zIndex : maxIndex;

      });
      if (dimmed.is(':visible')) {
        dimmed.css('z-index', maxIndex - 1);
        //dimmed.addClass('depth2');
      } else {
        dimmed.show().stop().animate({ opacity: 1 }, 500);
      }
    },
    //딤 hide
    dimmedHide: function() {
      var dimmed = $(common.selector.dimmed);
      if (dimmed.hasClass('depth2')) {
        dimmed.removeClass('depth2').css('z-index', '');
      } else {
        dimmed.stop().animate({ opacity: 0 }, 500, function() {
          $(this).hide();
        });
      }
    }
  };

  //스와이프
  var mySwiper = {
    swiper: null,
    el    : {
      swiperWrap: null,
      container : null,
      wrapper   : null,
      cont      : null,
      prevBtn   : null,
      nextBtn   : null,
      pagination: null,
      paging    : null
    },
    methodes: {
      init: function() {
        //기본 옵션
        var swiperInit = mySwiper.el.swiperWrap.find("[data-active]");

        var options = {
          allowTouchMove: true,
          loop          : false,
          autoplay      : false,
          spaceBetween  : 0,
          navigation    : false,
          pagination    : false,
          observer      : true,
          direction     : 'horizontal',
          freeMode      : false,
          centeredSlides: false,
          slidesPerView : 1,
          effect        : 'slide',
          autoHeight    : false,
          initialSlide  : swiperInit.length ? swiperInit.index() : 0,
          on            : swiperInit ? {
            //2023.08.03
            //vertical swiper
            slideChange: function() {
              var activeIdx = this.activeIndex;

              $(this.slides).each(function(idx, el) {
                if($(el).attr("data-active") !== undefined) {
                  $(el).removeAttr("data-active")
                }
                if(idx == activeIdx) {
                  $(el).attr("data-active", "")
                }
              })
            }} : {}
        };
        var optionData = mySwiper.el.swiperWrap.data('options') || {};

        var container = mySwiper.el.container;
        var pagination = mySwiper.el.pagination;
        var defaultPaging = '';

        pagination.find('.swiperMore').each(function() {
          var $this = $(this);
          defaultPaging += $this[0].outerHTML;
          $this.remove();
        });

        // 터치 이동 허용/불가
        if (optionData.touchMove) {
          options.allowTouchMove = optionData.touchMove;
        }

        //루프
        if (optionData.loop) {
          options.loop = true;
        }

        //간격
        if (optionData.Spacebetween > 0) {
          options.spaceBetween = optionData.Spacebetween;
        }

        //오토플레이
        if (optionData.autoplay > 0) {
          options.autoplay = {
            delay               : optionData.autoplay,
            disableOnInteraction: false
          };

          pagination
            .find('.btAutoplays')
            .children()
            .each(function() {
              var $this = $(this);
              $this.off('click').on('click', function() {
                var $this = $(this);
                var data = container.data('swiper');
                $this.hide().siblings('button').show();
                if ($this.hasClass('btStop')) {
                  data.autoplay.stop();
                } else {
                  data.autoplay.start();
                }
              });
            });
        }

        //버튼
        if (mySwiper.el.prevBtn.length > 0) {
          options.navigation = {
            nextEl: container.next('.swiper-button-next')[0],
            prevEl: container.prev('.swiper-button-prev')[0]
          };
        }

        //페이지네이션
        if (optionData.pagination === 'all') {
          // 두 타입 모두
          options.pagination = {
            el          : pagination,
            type        : 'custom',
            renderCustom: function(swiper, current, total) {
              // 기호
              if (this.el.find('.tyBl').length === 0) {
                this.el.prepend('<span class="tyBl"></span>');
              }
              var bl = '';
              for (var i = 1; i <= total; i++) {
                if (current === i) {
                  bl +=
                    '<span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span>';
                } else {
                  bl += '<span class="swiper-pagination-bullet"></span>';
                }
              }
              this.el.find('.tyBl').html(bl);

              // 숫자
              if (this.el.find('.tyNum').length === 0) {
                this.el.append('<div class="tyNum"></div>');
              }
              var num =
                '<div class="swiper-paging"><div class="paging"><span class="swiper-pagination-current">' +
                current +
                '</span>/<span class="swiper-pagination-total">' +
                total;

              if (defaultPaging !== '') {
                num += '</span></div>' + defaultPaging + '</div>';
              }
              num += '</span></div>';
              this.el.find('.tyNum').html(num);

              return;
            }
          };
        } else if (optionData.pagination === 'fraction') {
          // 숫자
          options.pagination = {
            el          : pagination,
            type        : 'custom',
            renderCustom: function(swiper, current, total) {
              if (this.el.find('.tyNum').length === 0) {
                this.el.append('<div class="tyNum"></div>');
              }
              var num =
                '<div class="swiper-paging"><div class="paging"><span class="swiper-pagination-current">' +
                current +
                '</span>/<span class="swiper-pagination-total">' +
                total;

              if (defaultPaging !== '') {
                num += '</span></div>' + defaultPaging + '</div>';
              }
              num += '</span></div>';
              this.el.find('.tyNum').html(num);
              return;
            }
          };
        } else if (pagination.length > 0) {
          // 기호
          options.pagination = {
            el          : pagination,
            type        : 'custom',
            renderCustom: function(swiper, current, total) {
              // 기호
              if (this.el.find('.tyBl').length === 0) {
                this.el.prepend('<span class="tyBl"></span>');
              }
              var bl = '';
              for (var i = 1; i <= total; i++) {
                if (current === i) {
                  bl +=
                    '<span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span>';
                } else {
                  bl += '<span class="swiper-pagination-bullet"></span>';
                }
              }
              this.el.find('.tyBl').html(bl);
              return;
            }
          };
        }

        // 몇개씩 보일지
        if (optionData.view !== undefined) {
          options.slidesPerView = optionData.view;
        }
        // 몇개씩 움직일지
        if (optionData.group > 0) {
          options.slidesPerGroup = optionData.group;
        }
        //가로,세로 방향
        if (optionData.vertical) {
          options.direction = 'vertical';
        }

        //모드(이펙트)
        if (optionData.mode) {
          options.effect = optionData.mode;
        }
        //autoHeight
        if (optionData.autoHeight) {
          options.autoHeight = true;
        }

        // 유사 스크롤 모드
        if (optionData.free) {
          options.freeMode = {
            enabled      : optionData.free,
            momentumRatio: 0.2,
            sticky       : true
          };
          //스냅 활성화
          if (optionData.freeSticky) {
            options.freeMode.sticky = optionData.freeSticky;
          }
        }

        if (optionData.centeredSlides) {
          options.centeredSlides = true;
        }

       
        if (optionData.initialSlide > 0) {
          options.initialSlide = optionData.initialSlide - 1;
        }

        //섬네일
        if (mySwiper.el.swiperWrap.hasClass('swiperThumb')) {
          options.watchSlidesProgress = true;
          options.freeMode = true;
        }

        if (container.data('swiper') !== undefined) {
          container.data('swiper').destroy();
        }
        var swiper = new common.Swiper(container, options);
        container.data('swiper', swiper);

        //섬네일 연동 스와이프
        if (mySwiper.el.swiperWrap.hasClass('swiperThumb')) {
          var wrap = mySwiper.el.swiperWrap;
          var nextCon = wrap
            .prev()
            .children('.swiper-container')
            .data('swiper');
          nextCon.thumbs.swiper = swiper;
          nextCon.thumbs.init();
          nextCon.thumbs.update(0);
        }

        //섬네일 initialSlide index번째에 thumb-active class 설정
        var activeSlideNum =  optionData.initialSlide
          
        if(optionData.initialSlide > 1) {
          $(".swiperThumb li").each(function(idx, el) {
            if (idx == activeSlideNum - 1) {
              $(el).addClass('swiper-slide-thumb-active');
            }
          });
        }

        // if (container.closest('.themeViewArea').length) {
        //   swiper.allowTouchMove = false;
        // }

      },
      swiperUpdate: function(target) {
        target.find('.swiper-container').each(function() {
          var $this = $(this);
          var sData = $this.data('swiper');
          sData.update();
        });
      }
    },
    handler    : {},
    setProperty: function(el) {
      this.el.swiperWrap = el;
      this.el.container = el.children('.swiper-container');
      this.el.wrapper = this.el.container.children('.swiper-wrapper');
      this.el.cont = this.el.wrapper.children('.swiper-slide');
      this.el.prevBtn = this.el.container.siblings('.swiper-button-prev');
      this.el.nextBtn = this.el.container.siblings('.swiper-button-next');
      this.el.pagination = this.el.container.siblings('.swiper-pagination');
      this.el.paging = this.el.container.siblings('.swiper-paging');

      this.methodes.init();
    },
    bind: function() {},
    init: function(el) {
      this.setProperty($(el));
    }
  };

  //팝업
  var popup = {
    el: {
      popup       : null,
      popBtn      : null,
      layContainer: null
    },
    POPUP_M_ANIMATE_SPEED: 500, //하단 팝업 애니메이션 속도
    methodes             : {
      //팝업 show
      show: function(target) {
        //팝업 다중 노출 시 z-index 처리
        if (common.el.doc.find('.layPop:visible').length > 0) {
          var maxIndex = 0;
          common.el.doc.find('.layPop:visible').each(function() {
            var $this = $(this);
            var zIndex = parseInt($this.css('z-index'));
            maxIndex = maxIndex < zIndex ? zIndex : maxIndex;
          });
          target.css('z-index', maxIndex + 1);
        }

        target.show();

        //하단에서 올라오는 팝업
        if (target.hasClass('layBtm')) {
          target.stop().animate({ bottom: 0 }, popup.POPUP_M_ANIMATE_SPEED);
          mvJs.utils.dimmedShow();
        }

        //가운데 정렬 팝업
        if (target.hasClass('layCent')) {
          target.show();
          mvJs.utils.dimmedShow();
        }

        //tab 초기화
        target.find(common.selector.tab).each(function() {
          var $this = $(this);
          $this.trigger('scroll.tab');
        });
        

        //스와이프 초기화
        mySwiper.methodes.swiperUpdate(target);

        utils.scrollDisabled();

        target
          .find('.layContainer')
          .off('scroll.popup')
          .on('scroll.popup', popup.handler.scroll);
        common.el.win
          .off('resize.popup')
          .on('resize.popup', popup.handler.resize);
        common.el.win.trigger('resize.popup');

        
      },
      //팝업 hide
      hide: function(target) {
        //하단에서 올라오는 팝업
        if (target.hasClass('layBtm')) {
          target
            .stop()
            .animate(
              { bottom: '-100%' },
              popup.POPUP_M_ANIMATE_SPEED,
              function() {
                target.hide();
                mvJs.utils.dimmedHide();
              }
            );
        } else if (target.hasClass('layCent')) {
          //가운데 정렬 팝업
          target.hide();
          mvJs.utils.dimmedHide();
        } else {
          //외 경우 (풀팝업)
          target.hide();
        }
        utils.scrollEnabled();
      }
    },
    handler: {
      show: function() {
        var $this = $(this);
        var popLayer = $('#' + $this.data('id'));

        popup.methodes.show(popLayer);
      },
      hide: function() {
        var $this = $(this);
        var popLayer = $this.closest('.layPop');
        popup.methodes.hide(popLayer);
      },
      resize: function(e) {
        common.el.doc.find('.layPop.layBtm').each(function() {
          var $this = $(this);
          if ($this.is(':visible')) {
            var max = visualViewport.height - $this.find('.closeL').height();

            if ($this.find('.titLay').length > 0) {
              max -= parseInt($this.find('.layContainer').css('margin-top'));
            }
            $this.find('.layContainer').css('maxHeight', max);
          }
        });
      },
      scroll: function() {
        
        var $this = $(this);
        var laypop = $this.closest('.layPop');
        var scrollTop = $this.scrollTop();
        //팝업 내부 스크롤 시 class on/off
        if (laypop.length > 0) {          
          if (scrollTop === 0 && laypop.hasClass('layScroll')) {
            laypop.removeClass('layScroll');
          }
          if (scrollTop > 0 && !laypop.hasClass('layScroll')) {
            laypop.addClass('layScroll');
          }
        }
      }

    },
    setProperty: function(el) {
      this.el.popBtn = el;
      this.el.popup = $('#' + el.data('id'));
      this.el.layCont = this.el.popup.find('.layContent');

    },
    bind: function() {
      this.el.popBtn.off('click.popup').on('click.popup', popup.handler.show);

      this.el.popup
        .find('>.closeL')
        .off('click.popup')
        .on('click.popup', popup.handler.hide);
      
      this.el.layCont
        .off('scroll.popup')
        .on('scroll.popup', popup.handler.scroll);

      common.el.win
        .off('resize.popup')
        .on('resize.popup', popup.handler.resize);
      $(visualViewport)
        .off('resize.popup')
        .on('resize.popup', popup.handler.resize);
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };


  //헤더 영역 기능
  var header = {
    el: {
      header  : null,
      menuWrap: null,
      navList : null,
      navCon  : null
    },
    selector: {
      mainTopbanner: '.mainTopbanner'
    },
    methodes: {
      navContral: function(idx, speed) {
        var navList = header.el.navList;
        var navListW = navList.outerWidth();
        var navCon = header.el.navCon;
        var target = header.el.navCon.eq(idx);
        var targetLeft = target.position().left;
        var navW = parseInt(navList.css('padding-left')) * 2;
        var scrollLeft = navList.scrollLeft();
        var aniSpeed = speed || 250;
        var moveVal =
          targetLeft + scrollLeft - parseInt(navList.css('padding-left'));
        navCon.each(function() {
          var $this = $(this);
          navW += $this.width();
        });

        if (moveVal + navListW > navW) {
          moveVal = navW - navListW;
        }

        header.el.navCon.removeClass('navON').eq(idx).addClass('navON');
        navList.stop().animate(
          {
            scrollLeft: moveVal
          },
          aniSpeed
        );
      }
    },
    handler: {
      topBannerClose: function() {
        var $this = $(this);
        var topBanner = $this.closest('.mainTopbanner');
        // topBanner.slideUp(function() {
        //   topBanner.remove();
        // });
        topBanner.animate({ marginTop: -topBanner.height() }, 200, function() {
          topBanner.remove();
        });
      },
      scroll: function() {
        var head = header.el.header;
        var scrollTop = common.el.win.scrollTop();
        //var headerH = header.el.menuWrap.height();
        //var fixedWrap = head.children('.fixedWrap');
        var wrap = head.closest('.wrapper');
        var mainTopbanner = $(header.selector.mainTopbanner);

        if (mainTopbanner.length > 0) {
          headerH += mainTopbanner.height();
        }

        if (wrap.hasClass('wrapper')) {
          if (scrollTop === 0 && head.hasClass('fixed')) {
            head.removeClass('fixed');
          }
          if (scrollTop > 0 && !head.hasClass('fixed')) {
            head.addClass('fixed');
          }
        }

        
      },
    },
    setProperty: function(el) {
      this.el.header = el;
      this.el.menuWrap = el.children('.menuWrap');
      this.el.navList = el.find('.navList');
      this.el.navCon = this.el.navList.children('h2');
    },
    bind: function() {
      var mainTopbanner = $(header.selector.mainTopbanner);
      common.el.win
        .off('scroll.header')
        .on('scroll.header', header.handler.scroll);

      this.el.navList.each(function() {
        var $this = $(this);
        $this
          .find('>h2>a')
          .off('click.navList')
          .on('click.navList', header.handler.navOn);
      });

      if (mainTopbanner.length > 0) {
        mainTopbanner
          .children('.btn_close')
          .off('click.header')
          .on('click.header', header.handler.topBannerClose);
      }
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //탭기능
  var tab = {
    el: {
      tabWrap: null,
      tab    : null,
      tabCon : null
    },
    selector: {},
    methodes: {
      tabOn: function(target, speed) {
        var tabScript = target.closest('.tabScript, .viewTab');
        var wrap = target.closest('ul');
        var targetA = target.children('a');
        var tabConData = targetA.data('controls');

        if (targetA.attr('aria-selected') === 'true') {
          return true;
        }

        //앵커 타입일 때 미동작
        if (!tabScript.hasClass('anchorTabFixed')) {
          targetA.attr('aria-selected', 'true');
          target.siblings('li').children('a').attr('aria-selected', 'false');
        }

        if (tabConData !== undefined) {
          var con = common.el.doc.find('#' + tabConData);
          //앵커 타입
          if (tabScript.hasClass('anchorTabFixed')) {
            var fixedH = wrap.height();

            if (wrap.closest('.viewTab').length > 0) {
              fixedH = wrap.outerHeight();
            }

            $('#wrapper header').each(function() {
              fixedH += $(this).height();
            });
            

            if (con.closest('.scriptScroll').length > 0) {
              con
                .closest('.scroll-content')
                .stop()
                .animate(
                  {
                    scrollTop:
                      con.position().top -
                      tabScript.height() +
                      con.closest('.scroll-content').scrollTop()
                  },
                  500
                );
            } else {
              $(common.selector.bh)
                .stop()
                .animate(
                  {
                    scrollTop: con.offset().top - fixedH
                  },
                  500
                );
                
            }
          } else {
            con
              .addClass('tabON')
              .siblings('.tabContentWrap')
              .removeClass('tabON');

            //스와이프 업데이트
            mySwiper.methodes.swiperUpdate(con);            
          }
        }

        tabScript.each(function() {
          var $this = $(this);
          if (wrap.css('overflow') === 'auto') {
            var aniSpeed = speed === undefined ? 200 : speed;

            tab.methodes.tabScrollMove(wrap, target, aniSpeed);
          }

          if (!tabScript.hasClass('anchorTabFixed') && !tabScript.hasClass('fixed')) {
            tab.methodes.tabScrollY($this);
          }
        });

        wrap.find('[class^="tabType"]').trigger('scroll');
      },
      tabScrollY: function(target) {
        if (target.closest('.viewTab').length > 0) {
          var header = common.el.doc.find('#wrapper > header');
          var tabH = -2;

          if (header.length > 0) {
            tabH += header.height();
          }
          
          $(common.selector.bh)
            .stop()
            .animate(
              {
                scrollTop: target.offset().top - tabH
              }
            );
			} else if (target.closest('.posTabFixed').length > 0) {
			var header = common.el.doc.find('#wrapper > header');
			var tabH = -2;

			if (header.length > 0) {
				tabH += header.height();
			}
			
			$(common.selector.bh)
				.stop()
				.animate(
				{
					scrollTop: target.offset().top - tabH - 63
				}
				);
			}
      },
      tabScrollMove: function(wrap, target, speed) {
        var wrapW = wrap.outerWidth(true);
        var wrapInnerW = tab.methodes.tabInnerWidth(wrap) - wrapW;
        var targetLeft = target.position().left;
        var scrollLeft = wrap.scrollLeft();
        var moveVal = targetLeft + scrollLeft - wrapW / 2 + target.width() / 2;
        if (moveVal < 0) {
          moveVal = 0;
        }
        // if (moveVal > wrapInnerW) {
        //   moveVal = wrapInnerW;
        // }

        wrap.stop().animate({ scrollLeft: moveVal }, speed);
      },
      tabInnerWidth: function(wrap) {
        var innerW = 0;
        wrap.children('li').each(function() {
          var $this = $(this);
          innerW += $this.width();
        });
        if (wrap.hasClass('tabType02')) {
          innerW += parseInt(wrap.css('padding-left')) * 2;
        }
        return innerW;
      }
    },
    handler: {
      click: function(e) {
        //탭 클릭 시
        var $this = $(this);
        if ($this.children('a').attr('href') === '#') {
          e.preventDefault();
        }
        tab.methodes.tabOn($this);
      },
      scroll: function() {
        //탭 가로 스크롤 시
        var $this = $(this);
        var wrap = $this.closest('ul');
        var wrapW = $this.closest('ul').outerWidth(true) + 5;
        // var wrapW = common.el.win.width();
        var scrollLeft = $this.scrollLeft();
        var nextBtn = $this.next('.next');
        var prevBtn = $this.prev('.prev');
        var idx = wrap.find('a[aria-selected=true]').closest('li').index();
        if (nextBtn.length > 0) {
          if (scrollLeft < tab.methodes.tabInnerWidth(wrap) - wrapW) {
            nextBtn.show();
          } else {
            nextBtn.hide();
          }

          if (scrollLeft > 0) {
            prevBtn.show();
          } else {
            prevBtn.hide();
          }
        }
      },
      resize: function() {
        $(common.selector.tab).each(function() {
          var $this = $(this);
          // var wrapW = $this.outerWidth(true);
          // var wrapInnerW = tab.methodes.tabInnerWidth($this) - wrapW;
          // console.log(wrapInnerW);
          $this.trigger('scroll.tab');
        });
      },
      moveBtn: function() {
        //prev next 버튼
        var $this = $(this);
        var wrap = $this.siblings('ul');

        wrap.children('li').each(function() {
          var cont = $(this);
          var viewSize = wrap.width() - $this.width();
          var targetSize = Math.floor(cont.position().left + cont.width());
          var scrollLeft = wrap.scrollLeft();

          if ($this.hasClass('next')) {
            if (viewSize < targetSize) {
              wrap
                .stop()
                .animate(
                  { scrollLeft: targetSize - viewSize + wrap.scrollLeft() },
                  200
                );
              return false;
            }
          } else {
            if (0 < targetSize - $this.width()) {
              wrap.stop().animate({ scrollLeft: scrollLeft - targetSize }, 200);
              return false;
            }
          }
        });
      },
      winScroll: function() {
        // 윈도우 스크롤 시
        var win = common.el.win;
        var doc = common.el.doc;
        var scrollTop = common.el.win.scrollTop();
        var viewTab = doc.find('.viewTab ');
        var posTabFixed = doc.find('.posTabFixed');
        var header = doc.find('#wrapper>header');
        var header2 = doc.find('#wrapper.anchorWrapper>header');
        var headScrollTop = 0;
        var headScrollTop2 = 0;
        if (header.length > 0) {
          headScrollTop = scrollTop + header.height();
        }
        if (header2.length > 0) {
          headScrollTop2 = scrollTop + header2.height();
          //console.log(headScrollTop2)
        }

        //고정 탭
        if (viewTab.length > 0) {
          if (
            viewTab.offset().top <= headScrollTop &&
            !viewTab.hasClass('fixed')
          ) {
            viewTab.addClass('fixed');
          } else if (
            viewTab.offset().top > headScrollTop &&
            viewTab.hasClass('fixed')
          ) {
            viewTab.removeClass(['fixed', 'tabScroll']);
          }
        }

        if (posTabFixed.length > 0) {
          if (
            posTabFixed.offset().top - 103 <= headScrollTop &&
            !posTabFixed.hasClass('posFixed')
          ) {
            posTabFixed.addClass('posFixed');
          } else if (
            posTabFixed.offset().top - 103 > headScrollTop &&
            posTabFixed.hasClass('posFixed')
          ) {
            posTabFixed.removeClass('posFixed');
          }
          
        }

        //고정 탭
        var fixedTab = doc.find('.tabScript.fixed');
        fixedTab.each(function() {
          var $this = $(this);
          if (scrollTop === 0 && $this.hasClass('tabScroll')) {
            $this.removeClass('tabScroll');
          }
          if (scrollTop > 0 && !$this.hasClass('tabScroll')) {
            $this.addClass('tabScroll');
          }
        });

        //앵커 탭 기능 대응
        var anchor = doc.find('.anchorTabFixed');
        //var anchorWrap = doc.find('.anchorWrapper');
        if (anchor.length > 0) {
          var anchorScroll = scrollTop + anchor.height() + 48;
          
          $('#wrapper header').each(function() {
            anchorScroll += $(this).height();
          });
          $('#wrapper.anchorWrapper header').each(function() {
            anchorScroll += $(this).height() - 48;
            //console.log(anchorScroll);
          });
          anchor.find('li>a').each(function(idx) {
            var $this = $(this);
            var target = $('#' + $this.data('controls'));
            var top = target.offset().top;
            var nextArea = target.nextAll('div[class*=anchorTab]').eq(0);
            var nextTop;
            if (nextArea.length) {
              nextTop = nextArea.offset().top;
            } else {
              nextTop =
                $this.closest('#container').offset().top +
                $this.closest('#container').outerHeight();
            }
            //console.log(nextTop.scrollTop);

            if (idx === 0 && top > anchorScroll) {
              $this.attr('aria-selected', 'true');
            } else if (top <= anchorScroll && anchorScroll < nextTop) {
              $this.attr('aria-selected', 'true');
            } else {
              $this.attr('aria-selected', 'false');
            }
          });
        }
      }
    },
    setProperty: function(el) {
      this.el.tabWrap = el;
      this.el.tab = el.children('li');
      this.el.btn = this.el.tabWrap.siblings('button');
    },
    bind: function() {
      this.el.tab.off('click.tab').on('click.tab', tab.handler.click);
      this.el.tabWrap.off('scroll.tab').on('scroll.tab', tab.handler.scroll);

      this.el.btn.each(function() {
        var $this = $(this);
        $this.off('click.tab').on('click.tab', tab.handler.moveBtn);
      });
      common.el.win.off('resize.tab').on('resize.tab', tab.handler.resize);
      common.el.win.off('scroll.tab').on('scroll.tab', tab.handler.winScroll);
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //툴팁
  var tooltip = {
    el: {
      btn : null,
      cont: null
    },
    selector: {
      header: '#wrapper > header'
    },
    handler: {
      show: function() {
        var $this = $(this);
        var cont = $this.next();
        if (!cont.is(':visible')) {
          cont.parent().addClass('tipON');
        }
      },
      close: function(e) {
        var $this = $(this);
        if ($this.closest('.tiptxtArea').length > 0) {
          e.preventDefault();
          $this.closest('.tiptxtArea').hide();
        } else if ($this.hasClass('btClose')) {
          $this.closest('.notiView').hide();
        } else {
          $this.closest('.tooltipCont').parent('.tooltipWrap').removeClass('tipON');
        }
      }
    },
    setProperty: function(el) {
      this.el.showBtn = el;
      this.el.cont = el.next();

      if (el.hasClass('tiptxtArea')) {
        this.el.showBtn = $({});
        this.el.closeBtn = el.find('.btnClose');
      } else if (el.hasClass('btNoti')) {
        this.el.closeBtn = this.el.cont.find('.btClose');
      } else {
        this.el.closeBtn = this.el.cont.find('.btnClose');
      }
    },
    bind: function() {
      this.el.showBtn.off('.tooltip').on('click.tooltip', this.handler.show);
      this.el.closeBtn.off('.tooltip').on('click.tooltip', this.handler.close);
    },
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //달력
  var datepicker = {
    el: {
      area: null
    },
    selector: {},
    methodes: {
      init: function(area) {
        var template = '';
        var today = new Date();
        var toYear = today.getFullYear();
        var toMonth = today.getMonth() + 1;
        var toDay = today.getDate();
        var options = {
          monthLength: 1,
          week       : ['일', '월', '화', '수', '목', '금', '토'],
          startTxt   : '체크인',
          endTxt     : '체크아웃'
        };
        var optionData = area.data('options') || {};

        // 현재 월 기준으로 나올 계월 수
        if (optionData.monthLength) {
          options.monthLength = optionData.monthLength;
        }

        // 시작일 텍스트
        if (optionData.startTxt) {
          options.startTxt = optionData.startTxt;
        }

        // 종료일 텍스트
        if (optionData.endTxt) {
          options.endTxt = optionData.endTxt;
        }

        // 템플릿 생성
        for (var i = 0; i < options.monthLength; i++) {
          var year = today.getFullYear();
          var month = today.getMonth() + 1;
          var startDay = new Date(year, month - 1, 1).getDay();
          var dayLength = new Date(year, month, 0).getDate();
          var prevDayLength = new Date(year, month - 1, 0).getDate();
          var col = Math.ceil((startDay + dayLength) / 7);

          template += '<div class="k1_calendar_wrap">';
          template +=
            '<div class="k1_sel_month">' + year + '년 ' + month + '월</div>';
          template += '<table class="k1_board_mcal">';
          template += '<thead><tr>';
          options.week.forEach(function(val) {
            template += '<th>' + val + '</th>';
          });
          template += '</tr></thead>';
          template += '<tbody>';

          for (var j = 0; j < col; j++) {
            template += '<tr>';
            for (var s = 1; s < 8; s++) {
              var num = s + j * 7 - startDay;

              if (num <= 0) {
                // 이전 월 표시
                template +=
                  '<td class="off prevMonth">' +
                  (prevDayLength + num) +
                  '</td>';
              } else if (num > dayLength) {
                // 다음 월 표시
                template +=
                  '<td class="off nextMonth">' + (num - dayLength) + '</td>';
              } else if (
                new Date(year, month, num) < new Date(toYear, toMonth, toDay)
              ) {
                // 오늘 이전 날
                template += '<td class="off">' + num + '</td>';
              } else {
                template +=
                  '<td><a href="#" role="button">' + num + '</a></td>';
              }
            }
            template += '</tr>';
          }
          template += '</tbody>';
          template += '</table>';
          template += '</div>';
          today.setMonth(today.getMonth() + 1);
        }

        // 기존 폼 제거 후 템플릿 적용
        area.children().remove();
        area.append(template);

        // 기본 세팅
        area.children('.k1_calendar_wrap').each(function() {
          var $this = $(this);
          var ymTxt = $this.find('.k1_sel_month').text();
          var onDay = $this.find('tbody td').not('.off');
          var evtData = {
            year  : toYear,
            month : toMonth,
            day   : toDay,
            option: options
          };

          // 토, 일 체크
          $this
            .find('tbody')
            .children('tr')
            .each(function() {
              var $this = $(this);
              var td = $this.children('td');
              td.first().not('.off').addClass('sun');
              td.last().not('.off').addClass('sat');
            });

          // 오늘 날짜 체크
          if (ymTxt.indexOf(toYear) > -1) {
            if (ymTxt.indexOf(toMonth) > -1) {
              onDay
                .children('a:contains(' + toDay + ')')
                .filter(function(idx, target) {
                  return target.innerText === String(toDay);
                })
                .closest('td')
                .addClass('today');
            }
          }

          onDay.children('a').each(function() {
            var $this = $(this);
            $this
              .off('click.datepicker')
              .on('click.datepicker', evtData, datepicker.handler.dayPick);
          });
        });
      }
    },
    handler: {
      dayPick: function(e) {
        e.preventDefault();
        var $this = $(this);
        var regex = /[^0-9]/g;
        var pick = $this.closest('td');
        var area = $this.closest('.k1_calendarMulti');
        var wrap = $this.closest('.k1_calendar_wrap');
        var dateArea = wrap.find('.k1_sel_month');
        var tbody = area.find('tbody');
        var tr = tbody.children('tr');
        var td = tr.children('td');
        var start = tr.children('td.start');
        var end = tr.children('td.end');
        var evtData = e.data;
        var yy = dateArea.text().split(' ')[0].replace(regex, ''); //년도
        var mm = dateArea.text().split(' ')[1].replace(regex, ''); //월
        if (mm.length < 2) {
          mm = '0' + mm;
        }
        var dd = $this.text(); //일
        if (dd.length < 2) {
          dd = '0' + dd;
        }
        var options = e.data.option;

        if (start.length > 0 && end.length > 0) {
          start.removeClass('start').children('.txt').remove();
          start = area.find('tbody td.start');
          end.removeClass('end').children('.txt').remove();
          end = area.find('tbody td.end');
          area.find('.range').removeClass('range');
        } else if (td.index(start) > td.index(pick)) {
          start.removeClass('start').children('.txt').remove();
          start = area.find('tbody td.start');
        }

        if (start.length === 0) {
          $this.after('<span class="txt">' + options.startTxt + '</span>');
          pick.addClass('start');
          //선택 날짜 val 로 전달
          area
            .val(yy + '-' + mm + '-' + dd)
            .attr('value', yy + '-' + mm + '-' + dd);
        } else if (end.length === 0) {
          var startDate = area.val();
          if ($this.siblings('.txt').length > 0) {
            return false;
          } else {
            $this.after('<span class="txt">' + options.endTxt + '</span>');
            area
              .val(startDate + ' ~ ' + yy + '-' + mm + '-' + dd)
              .attr('value', startDate + ' ~ ' + yy + '-' + mm + '-' + dd);
          }
          pick.addClass('end');

          // 범위 표시
          start.nextAll('td').not('.off, .end').addClass('range');
          pick.prevAll('td').not('.off, .range, .start').addClass('range');
          start.prevAll('td').not('.off').removeClass('range');
          pick.nextAll('td').not('.off').removeClass('range');

          var startCol = tr.index(start.closest('tr'));
          var endCol = tr.index(pick.closest('tr'));

          if (endCol - startCol > 1) {
            for (var i = 1; i < endCol - startCol; i++) {
              tr.eq(startCol + i)
                .find('td')
                .not('.off')
                .addClass('range');
            }
          }
        }
      }
    },
    setProperty: function(el) {
      this.el.area = el;
    },
    init: function(el) {
      this.setProperty($(el));
      datepicker.methodes.init(this.el.area);
    }
  };

  //슬라이더
  var slider = {
  el: {
    target  : null,
    viewArea: null
  },
  selector: {},
  methodes: {
    init: function() {
      //기본 옵션
      var target = slider.el.target;
      var optionData = target.data('options') || {};
      var options = {
        range : optionData.range || false,
        min   : optionData.min || null,
        max   : optionData.max || null,
        step  : optionData.step || null,
        value : optionData.value || 0,
        values: optionData.values || null,
        //text  : optionData.text || null,
        slide : function() {}
      };

      // if (target.data('uiSlider') !== undefined) {
      //   return false;
      // }
      var mySlider = target.slider(options);
      var valueTip = $('.valueTip');

      if (slider.el.viewArea.length > 0) {
        slider.el.viewArea.children('.amount').each(function(idx) {
          var $this = $(this);
          $this.val(
            slider.methodes.comma(optionData.values[idx])
          );
        });
      }
      mySlider.on('slide', options, slider.handler.slide);

      //매물 시세 초기 값 설정
      $('.valueTip span').text($('.valueTip span').attr("value"))
      
      //input에 값 입력 시 slider handle 위치 변경
      $('.slideInp .amountMin').off('change.etc').on('change.etc', function(el) {
        var range = $(el.currentTarget.closest('.slideInp')).prev();
        var prevValue = range.slider("option", "values");
        var minValue = Number(range.slider("option", "min"));
        var currentValue = Number(el.currentTarget.value);

        if(currentValue < minValue) {
          currentValue = minValue;
          $(el.target).val(minValue);
        }
        range.slider("option", "values", [currentValue, prevValue[1]]);
      });

      $('.slideInp .amountMax').off('change.etc').on('change.etc', function(el) {
        var range = $(el.currentTarget.closest('.slideInp')).prev();
        var prevValue = range.slider("option", "values");
        var maxValue = Number(range.slider("option", "max"));
        var currentValue = Number(el.currentTarget.value);

        if(currentValue > maxValue) {
          currentValue = maxValue;
          $(el.target).val(maxValue);
        }
        range.slider("option", "values", [prevValue[0], currentValue]);
      });
    },
    comma: function(number) {
      return number.toLocaleString('en');
    }
  },
  handler: {
    slide: function(e, ui) {
      var options = e.data;
      var target = $(e.target);
      var amount = target.next('.slideInp').children('.inpW').children('.amount');

      //slider value
      var result = String(ui.value).substring(0, String(ui.value).length - 4);

      //10억 이상, ex) 10억 -> 1,000,00
      if(result.length >= 6) {
        $('.valueTip span').text(result.substring(0,1) + "," + result.substring(1,4) +  "," + result.substring(4, 6))
      //10억 미만, ex) 9억 -> 900,00
      } else if (result.length < 6) {
        $('.valueTip span').text(result.substring(0,3) +  "," + result.substring(3, 5))
      }

      if (options.range === true) {
        if (ui.values[0] + options.step > ui.values[1]) {
          return false;
        }
      }

      amount.each(function(idx) {
        var $this = $(this);
        var val = ui.values[idx];
        if (val === null) {
          val = 0;
        }
        $this.val(slider.methodes.comma(val));
      });
    }
  },
  setProperty: function(el) {
    this.el.target = el;
    this.el.viewArea = el.next('.slideInp').children('.inpW');

    this.methodes.init();
  },
  bind: function() {},
  init: function(el) {
    this.setProperty($(el));
    this.bind();
  }
  };

  //정렬
  var sortable = {
    el: {
      target: null
    },
    selector: {},
    methodes: {
      init: function() {
        sortable.el.target.sortable({
          handle     : '.btIco',
          cancel     : '',
          containment: sortable.el.target,
          animation  : 150,
          axis       : 'y',
          scroll     : false,
          revert     : 150,
          start      : function() {
            var sort = $(this).sortable('instance');
            sort.containment[3] += 25;
            sort.containment[1] -= 25;
          }
        });
        sortable.el.target.disableSelection();
      }
    },
    handler    : {},
    setProperty: function(el) {
      this.el.target = el;

      this.methodes.init();
    },
    bind: function() {},
    init: function(el) {
      this.setProperty($(el));
      this.bind();
    }
  };

  //기타
  var etc = {
    el      : {},
    selector: {
      inpDeleteAni   : '.inpDeleteAni',
      toggleList     : '.toggleList',
      toggleType02	 : '.toggleType02',
      allCheck       : '.agree> .large',
      toggleAgree    : '.agreeList.toggleList',
      frmAcctList    : '.frmAcctList .inpAcct, .frmColGroup .frmInp',
      selTotal       : '.selTotal',
      searchIcon     : '.searchIcon',
      listNumBtns    : '.listNumBtns',
      //rentercarList  : '.rentercarList > .rentcarItemGroup',
      themeViewBtn   : '.themeViewBtn > button',
      //eagVisual      : '.eagVisual',
      edtFeed        : '.moreCont',
      moreContType02 : '.moreContType02',
      //tumblerBox     : '.tumblerBox',
      tabLink        : 'a[href^="#tabContents"]',
      btTop          : '.btTop',
      //ambassadorBtn  : '.ambassadorMain .viewBtn',
      //toggleEvt      : '.descBox.toggleEvt',
      fileInput      : '.file',
      listDestination: '.listDestination',
      fixToggle      : '.fixToggle',
      contractTab    : '.contractTab',
      contractAcc    : '.contractAcc > .acctItem',
      inpDateF       : '.inpDateF',
      agendaList     : '.agendaList',
      scrollArea     : '.scrollArea',
      pageAsideBtn   : '.pageAside .btNote',
      featureControl : '.featureControl .option',
      menuWrap       : '.menuWrap'
    },

    handler: {
      scroll: function() {
        var win = $(this);
        var scrollTop = win.scrollTop();
        var topBtn = $(etc.selector.btTop);
        var obj = $(etc.selector.fixToggle);
        var wheeling;

        // 탑버튼 제어
        if (! $('#dragTop').length) {
          // #dragTop 영역이 없는 페이지
          if (topBtn.length > 0) {
            if (scrollTop > 0) {
              if (!topBtn.is(':visible')) {
                topBtn.fadeIn();
              }
            } else {
              topBtn.fadeOut();
            }
          }
        } else {
          // #dragTop 영역이 있는 페이지 - BSG_010201_P.html
          // 목록 레이어 밖 스크롤 시 btTop 버튼 숨김
          $(topBtn).css('display', 'none');
        }     
        
        //일정관리 메인 플로팅 버튼
        
        win.on('scroll', function(e){
          if (!wheeling) {
            obj.css('opacity','0');
          }
          clearTimeout(wheeling);
          wheeling = setTimeout(() => {
            obj.css('opacity','1');
            wheeling = undefined;
            }, 1000);
          })

        },

      
      // 인풋박스 내용이 있을 때 내용 삭제 버튼 노출
      inputValCheck: function() {
        var $this = $(this);
        var removeBtn = $this.next(etc.selector.icDel);
        setTimeout(function() {
          var val = $this.val();
          if (val !== '') {
            removeBtn.show();
          } else {
            removeBtn.hide();
          }
        }, 10);
      },
      // 인풋박스 내용 삭제
      inputRemoveBtn: function() {
        var $this = $(this);
        var input = $this.prev('input');
        input.val('');
        input.trigger('keydown');
      },
      // 토글 컨텐츠 제어
      toggleList: function() {
        var $this = $(this);
        var check = $this.attr('aria-expanded');
        var cont = $this.next('.toggleCont');
        if (check === 'true') {
          $this.attr('aria-expanded', 'false');
        } else {
          $this.attr('aria-expanded', 'true');
        }
        mySwiper.methodes.swiperUpdate(cont);
      },
      // 토글 컨텐츠 제어2
      toggleType02: function() {
        var $this = $(this);
		    var etcLI = $('.toggleType02 > .acctItem');
        var check2 = $this.attr('aria-expanded');
        if (check2 === 'true') {
          $this.attr('aria-expanded', 'false');
          etcLI.removeClass('on').children('.toggleBtn').attr('aria-expanded', 'false');
		      $(this).parent().removeClass('on').children().attr('aria-expanded', 'false');		    
		    }  else {
          $this.attr('aria-expanded', 'true');		  
          etcLI.removeClass('on').children('.toggleBtn').attr('aria-expanded', 'false');
		      $(this).parent().addClass('on').children().attr('aria-expanded', 'true');;
        }        
      },
      // 전체 선택 체크 박스 기능
      allCheck: function(e) {
        var $this = $(this);
        var checked = $this.prop('checked');
        var conts = $(e.data.conts);
        var toggleAgree = $(e.data.toggleAgree);
        var count = 0;

        if (checked) {
          if ($this.closest('.agreeList.toggleList').length > 0) {
            conts.each(function() {
              if ($(this).is(':checked')) {
                count++;
              }
            });
            if (count > 0) {
              return true;
            }
          }
          conts.prop('checked', true);
          toggleAgree.prop('checked', true).trigger('change');
        } else {
          conts.prop('checked', false);
          toggleAgree.prop('checked', false).trigger('change');
        }
      },
      // 전체 선택 체크 박스의 목록 체크박스 기능
      allCheckCon: function(e) {
        var conts = $(e.data.conts);
        var all = $(e.data.all);
        var type = e.data.type;
        var count = 0;

        conts.each(function() {
          var $this = $(this);
          if ($this.prop('checked') === true) {
            count++;
          }
        });

        var checkOn = count === conts.length;
        if (type === 'once') {
          checkOn = count > 0;
        }

        if (checkOn) {
          all.prop('checked', true);
          if (all.closest('.toggleList').length > 0) {
            all.trigger('change');
          }
        } else {
          all.prop('checked', false);
          if (all.closest('.toggleList').length > 0) {
            all.trigger('change');
          }
        }
      },
      // 모바일 키패드 열릴 때 하단 버튼 고정 처리
      moFocusIn: function() {
        setTimeout(function() {
          common.el.doc.find('.floatingBtns').each(function() {
            var $this = $(this);
            $this.addClass('floatAbs');
          });
        }, 50);
      },
      // 모바일 키패드 열릴 때 하단 버튼 고정 처리
      moFocusOut: function() {
        setTimeout(function() {
          common.el.doc.find('.floatingBtns').each(function() {
            var $this = $(this);
            $this.removeClass('floatAbs');
          });
        }, 50);
      },
      //radio, checkbox 선택 시 컨텐츠 show/hide
      frmChange: function() {
        var $this = $(this);
        var span = $this.closest('span');
        var wrap = $this.closest('.frmAcctList');
        var frmColGroup = $this.closest('.frmColGroup');

        if (frmColGroup.length > 0) {
          //frmColGroup.find('.chkON').removeClass('chkON');
          $this.closest('.frmInp').toggleClass('chkON');
        } else {
          if ($this.attr('type') === 'checkbox') {
            wrap.find('.inpAcct>input[type=checkbox]').each(function() {
              var $this = $(this);
              var span = $this.closest('span');
              span.attr('aria-expanded', $this.prop('checked'));
            });
          } else {
            span.attr('aria-expanded', $this.prop('checked'));
          }
        }
        mySwiper.methodes.swiperUpdate(wrap);
      },
      //검색input 포커스 in 시 클래스 on
      searchFocusIn: function(e) {
        var $this = $(this);
        if ($(e.target).hasClass('icDel')) {
          return false;
        }
        $this.addClass('inpFocus');
      },
      //검색input 포커스 out 시 클래스 off
      searchFocusOut: function() {
        var $this = $(this);
        $this.removeClass('inpFocus');
      },
      // 보기 버튼
      listNumBtns: function() {
        var $this = $(this);
        var listNum = $this.closest('.listNum');
        var photoList = listNum.next('.photoList');
        var toggleTarget;

        $this.attr('aria-selected', 'true');
        if ($this.hasClass('btnViewS')) {
          photoList.addClass('typeCol');
          toggleTarget = $this.next('button');
        } else {
          photoList.removeClass('typeCol');
          toggleTarget = $this.prev('button');
        }
        toggleTarget.attr('aria-selected', 'false');
      },
      // themeViewBtn: function() {
      //   var $this = $(this);
      //   var btn = $this.closest('.themeViewBtn');
      //   var area = btn.next('.themeViewArea');
      //   var dataS = area.find('.swiper-container').data('swiper');
      //   area.removeClass('off');
      //   btn.hide();
      //   dataS.allowTouchMove = true;
      //   mySwiper.methodes.swiperUpdate(area);
      // },
      // 더보기 기능
      edtMore: function() {
        var $this = $(this);
        var edtFeedList = $this.prev('.moreList');
        var toggleCon = edtFeedList.children('li:nth-child(n+4)');

        $this.children('span').each(function() {
          var $this = $(this);
          if ($this.hasClass('true')) {
            $this.removeClass('true').addClass('false');
          } else {
            $this.removeClass('false').addClass('true');
          }
        });

        if (toggleCon.hasClass('none')) {
          toggleCon.removeClass('none').addClass('block');
        } else {
          toggleCon.removeClass('block').addClass('none');
        }
      },

      moreContType02: function() {
        var $this = $(this);
        var moreCont = $this.prev('.moreCont');
        var toggleCon = moreCont;

        $this.each(function() {
          var $this = $(this);
          if ($this.hasClass('close')) {
            $this.removeClass('close');
          } else {
            $this.addClass('close');
          }
        });

        if (toggleCon.hasClass('moreOpen')) {
          toggleCon.removeClass('moreOpen');
        } else {
          toggleCon.addClass('moreOpen');
        }
      }
    },
    bind: function() {
      common.el.win.off('scroll.etc').on('scroll.etc', etc.handler.scroll);
      common.el.win.off('resize.etc').on('resize.etc', etc.handler.resize);
      $(visualViewport)
        .off('resize.viewport')
        .on('resize.viewport', etc.handler.resize);

      
        //textarea
      if ($('textarea').attr('rows') === undefined) {
        $('textarea').attr('rows', 3);
      }
      
      $(document)
      .on('input.autoExpand', 'textarea', function() {
          var maxRows = 10;
          if ($(this).data('minRows') === undefined) {
              $(this).data('minRows', 3);
              $(this).data('lineHeight', parseInt($(this).css('lineHeight'), 100));
          }
          this.rows = $(this).data('minRows');
          this.style.height = 'auto';

          rows = Math.floor((this.scrollHeight) / $(this).data('lineHeight'));
          this.rows = rows - $(this).data('minRows');

          if (this.rows >= maxRows) {
              this.style.height = (maxRows * $(this).data('lineHeight')) + 'px';
          } else {
              this.style.height = this.scrollHeight + 'px';
          }
        });

      // 인풋박스 내용 삭제 버튼 제어
      $(etc.selector.inpDeleteAni).each(function() {
        var $this = $(this);
        var btn = $this.find('.icDel');
        var input = $this.find('input');
        btn
          .off('click.removeBtn')
          .on('click.removeBtn', etc.handler.inputRemoveBtn);
        input
          .off('keydown.removeBtn')
          .on('keydown.removeBtn', etc.handler.inputValCheck);
        input.trigger('keydown.removeBtn');
      });

      // 토글 컨텐츠 제어
      $(etc.selector.toggleList).each(function() {
        var $this = $(this);
        var btn = $this.find('.toggleBtn');
        btn
          .off('click.toggleList')
          .on('click.toggleList', etc.handler.toggleList);
      });

      // 토글 컨텐츠 제어2
      $(etc.selector.toggleType02).each(function() {
        var $this = $(this);
        var btn2 = $this.find('.toggleBtn');
        btn2
          .off('click.toggleType02')
          .on('click.toggleType02', etc.handler.toggleType02);
      });
      

      // 체크 박스 전체 선택 제어
      $(etc.selector.allCheck).each(function() {
        var $this = $(this);
        var allCheck = $this.find('input[type=checkbox]');
        var checkCon = $this
          .nextAll('.agreeList')
          .not('.toggleList')
          .find('input[type=checkbox]');
        var checkCon2 = $this
          .closest('.agree')
          .find(
            '.agreeList.toggleList .acctItem > .frmInp input[type=checkbox]'
          );

        if (checkCon2.length > 0) {
          checkCon = checkCon.add(checkCon2);
        }

        var data = {
          all        : allCheck,
          conts      : checkCon,
          toggleAgree:
            $this
              .nextAll('.agreeList.toggleList')
              .find('.acctItem > .frmInp input[type=checkbox]') || {}
        };
        allCheck
          .off('change.allCheck')
          .on('change.allCheck', data, etc.handler.allCheck);
        checkCon
          .off('change.allCheck')
          .on('change.allCheck', data, etc.handler.allCheckCon);
      });
      // 전체 선택 체크 박스의 목록 체크박스 제어
      $(etc.selector.toggleAgree).each(function() {
        var $this = $(this);
        var tit = $this.find('.acctItem > .frmInp input[type=checkbox]');
        var cont = $this.find('.toggleCont input[type=checkbox]');
        tit
          .off('change.allCheck2')
          .on('change.allCheck2', { conts: cont }, etc.handler.allCheck);
        cont
          .off('change.allCheck2')
          .on(
            'change.allCheck2',
            { all  : tit,
              conts: cont,
              type : 'once' },
            etc.handler.allCheckCon
          );
      });

      // 모바일 키패드 열릴 때 하단 버튼 고정 처리
      common.el.doc
        .find('input[type="text"],input[type="tel"],input[type="email"]')
        .each(function() {
          var $this = $(this);
          $this.on('focusin', etc.handler.moFocusIn);
          $this.on('focusout', etc.handler.moFocusOut);
        });

      //radio, checkbox 선택 시 컨텐츠 show/hide
      $(etc.selector.frmAcctList).each(function() {
        var $this = $(this);
        var box = $this.children('input');
        box.off('change.etc').on('change.etc', etc.handler.frmChange);
      });

      //전체 선택 시 check 값 초기화
      $(etc.selector.selTotal).each(function() {
        var $this = $(this);
        var total = $this.children('.total').children('input');
        var conts = $this.children('li').not('.total').children('input');
        conts.off('change.etc').on('change.etc', function() {
          var count = 0;
          conts.each(function() {
            var $this = $(this);
            if ($this.prop('checked') === false) {
              count += 1;
            }
          });
          if (!count) {
            conts.prop('checked', false);
            conts.attr('checked', 'false');
            total.prop('checked', true);
            total.attr('checked', 'true');
            return false;
          }
          total.prop('checked', false);
          total.attr('checked', 'false');
        });
        total.off('change.etc').on('change.etc', function() {
          conts.prop('checked', false);
          conts.attr('checked', 'false');
        });
      });

      //검색input 클래스 on/off
      $(etc.selector.searchIcon).each(function() {
        var $this = $(this);
        $this.off('focusin.etc').on('focusin.etc', etc.handler.searchFocusIn);
        $this
          .off('focusout.etc')
          .on('focusout.etc', etc.handler.searchFocusOut);
      });

      // 보기 버튼
      $(etc.selector.listNumBtns).each(function() {
        var $this = $(this);
        $this
          .children('button')
          .off('click.etc')
          .on('click.etc', etc.handler.listNumBtns);
      });

      // 더보기 기능
      $(etc.selector.edtFeed).each(function() {
        var $this = $(this);
        var btn = $this.children('.toggleBtn');
        btn.off('click.etc').on('click.etc', etc.handler.edtMore);
      });

      // 더보기 기능2
      $(etc.selector.moreContType02).each(function() {
        var $this = $(this);
        var btn = $this.children('.toggleBtn');
        btn.off('click.etc').on('click.etc', etc.handler.moreContType02);
      });

      

      //탭 링크
      $(etc.selector.tabLink).each(function() {
        var $this = $(this);
        
        $this.off('click.etc').on('click.etc', function(e) {
          e.preventDefault();
          var $this = $(this);
          var link = $($this.attr('href'));
          var idx = link.index('.tabContentWrap');
          var tabWrap = link.prevAll('.tabScript');

          if (tabWrap.length === 0) {
            tabWrap = link.prevAll('.viewTab');
          }

          var li = tabWrap.find('ul li').eq(idx);
          li.children('a').attr('aria-selected', 'false');
          li.trigger('click');
          tab.methodes.tabScrollY(tabWrap);
        });
      });

      //2023.07.24
      //소재·금액 탭 아코디언과 매칭 제어
      $(etc.selector.contractTab).each(function() {
        var $this = $(this);
        var tab =  $this.find('ul li a');
        var acc = $this.next().find('.acctItem .toggleBtn');

        $this.off('click.etc').on('click.etc', function(e) {
          e.preventDefault();
          
          tab.each(function(idx) {
            if ($(tab[idx]).attr('aria-selected') == 'true') {
              var setData = tab[idx].dataset.jsTabacc;
              var accCurrent = $this.next().find('[data-js-tabacc="'+setData+'"]');

              $(accCurrent.find('button')[0]).attr('aria-expanded', 'true')
            } else {
              $(acc[idx]).attr('aria-expanded', 'false')
            }
          })
          
        });
      });

      $(etc.selector.contractAcc).each(function() {
        var $this = $(this);
        var tab =  $this.closest('.contractTabCont').find('ul li');
        var acc = $this.closest('.contractAcc').find('.acctItem');

        $this.off('click.etc').on('click.etc', function(e) {
          e.preventDefault();
          
          acc.each(function(idx) {
            if ($(acc[idx]).hasClass('on') == true) {
              var setData = acc[idx].dataset.jsTabacc;
              var accCurrent = tab.find('[data-js-tabacc="'+setData+'"]');

              tab.each(function(idx) {
                $(tab[idx]).find('a').attr('aria-selected', 'false')
              })
              accCurrent.attr('aria-selected', 'true')
            } 
          })
        });
      });
      // 2023.07.24

      //첨부파일 이름
      $(etc.selector.fileInput).each(function() {
        var txtArea = $(this);
        var input = txtArea.prev('input[type=file]');
        input.off('change.etc').on('change.etc', function(e) {
          var $this = $(this);
          txtArea.val($this[0].files[0].name);
          txtArea.attr('value', $this[0].files[0].name);
        });
      });

      //제스쳐로 닫기/열기
      $(etc.selector.listDestination).each(function() {
        var $this = $(this);
        var btn = $this.find('>.sortingArea > .dragBtn');
        var jessBtn = $this.find('>.destiWrap > .dragBtn');

        jessBtn.off('click.etc').on('click.etc', function() {
          if (!$this.hasClass('dragTop')) {
            $this.addClass('dragTop');
          } else {
            $this.removeClass('dragTop');
          }
        });
        
        jessBtn.off('.etc');
        jessBtn.on('touchstart.etc', function(e) {
          var sTime = e.timeStamp;
          var start = e.originalEvent.changedTouches[0].clientY;
          jessBtn.on('touchend.etc', function(e) {
            var eTime = e.timeStamp;
            var end = e.originalEvent.changedTouches[0].clientY;
            if (eTime - sTime < 700) {
              if (start < end && $this.hasClass('dragTop')) {
                //down
                $this.removeClass('dragTop');
                $('.btTop').css('display', 'none');
                $(this).next().scrollTop(0);

                mvJs.utils.scrollEnabled();
              } else if (start > end && !$this.hasClass('dragTop')) {
                //up
                $this.addClass('dragTop');

                mvJs.utils.scrollDisabled();
              }
            }
            jessBtn.off('touchend.etc');
          });
        });
      });

      //2023.07.31
      //날짜 입력
      $(etc.selector.inpDateF).each(function() {
        var $this = $(this);
        var input = $this.find('input:first-child');
        var btn = $this.find('input[type=date]');
        
        input.off('input.etc').on('input.etc', function(e) {
          var temp = e.target.value.replace(/\D/g, "")
          
          if(temp.length < 5) {
            input.val(temp)
          } else if(temp.length < 7) {
            input.val(temp.substring(0,4) + "-" + temp.substring(4))
          } else {
            input.val(temp.substring(0,4) + "-" + temp.substring(4,6) + "-" + temp.substring(6,8))
          } 
        });

        btn.off('change.etc').on('change.etc', function() {
          $this.find('input:first-child').val(btn.val())
        });
      });
      //2023.07.31

      // 탑버튼
      $(etc.selector.btTop).each(function() {
        var $this = $(this);
        $this.off('click.etc').on('click.etc', function(e) {
          e.preventDefault();
          $(common.selector.bh).stop().animate({scrollTop: 0}, 500);
        });
      });

      // 보기 버튼
      // $(etc.selector.themeViewBtn).each(function() {
      //   var $this = $(this);
      //   $this.off('click.etc').on('click.etc', etc.handler.themeViewBtn);
      // });

      //2023.08.03
      //data-focus 'true'인 list로 스크롤 이동
      $(etc.selector.agendaList).each(function() {
        var $this = $(this);
        var lists = $this.children();
        var fillterWrap = $('.fillterWrap')[0];
        history.scrollRestoration = 'manual';
        
        lists.each(function(idx, el) {
          if($(el).attr("data-focus") == "true") {
            const move =  window.scrollY + el.getBoundingClientRect().top - fillterWrap.getBoundingClientRect().bottom;
            window.scrollTo(0,move)
          }
        })
      });

      //2023.08.07
      //BSG_010201_P.html, destiWrap 영역 내 스크롤 시 탑버튼 생성 및 제거
      $(etc.selector.scrollArea).each(function() {
        $(this).scroll(function() {
          if($(this).scrollTop() > 100) {
            $('.btTop').fadeIn();
          } else {
            $('.btTop').fadeOut();
          }

          $('.btTop').each(function() {
            var $this = $(this);
            $this.off('click.etc').on('click.etc', function(e) {
              e.preventDefault();
              $(etc.selector.scrollArea).stop().animate({scrollTop: 0}, 500);
            });
          });
        })
      });

      //2023.08.08
      //플로팅 버튼 보기·숨김
      $(etc.selector.pageAsideBtn).each(function() {
        var $this = $(this);
        
        var btnWraps = $this.next().find('.inner');
        var btnWrapsTop = btnWraps.offset().top;

        $this.off('click.etc').on('click.etc', function(e) {
          e.preventDefault();

          if($this.attr('aria-expanded') == 'true') {
            $this.attr('aria-expanded' , 'false');
            btnWraps.removeClass('btAni');

            btnWraps.stop().animate({ bottom: -btnWrapsTop }, 0.1);
            
            mvJs.utils.scrollEnabled();
          } else {
            $this.attr('aria-expanded' , 'true');

            setTimeout(function() {
              btnWraps.addClass('btAni');
            }, 300)

            btnWraps.stop().animate({ bottom: 0 });

            $('.tabWrap').hasClass('fixed')
            ? $('.pageDimm').css('top', $('header').outerHeight(true))
            : $('.pageDimm').css('top', $('.tabType01').offset().top)

            mvJs.utils.scrollDisabled();
          }
        });
      });

      //2023.08.08
      //지도 스크립트 - 1
      $(etc.selector.featureControl).each(function() {
        var $this = $(this);
        var btn = $this.next();

        //매물·도구 버튼 클릭 시
        btn.on('click', function(){
          $(this).siblings('.option').toggleClass('show')
        })

        //매물·도구 옵션 버튼 클릭 시
        $this.find('.ico').on('click', function(){
          var defaultSale = {id: 'ico icoSale isCurrent', name:'매물'}
          var defaultTool = {id: 'ico icoTool isCurrent', name:'도구'}
          var options = $(this).closest('.option');

          if ($(this).hasClass('isSelected', true)) {
            //선택 해제
            $(this).removeClass('isSelected').siblings().removeClass('isSelected');
            options.toggleClass('show')

            if (options.hasClass('sale')) {
              options.next().attr('class', defaultSale.id);
              options.next().text(defaultSale.name);
            } else if(options.hasClass('tool')){
              options.next().attr('class', defaultTool.id);
              options.next().text(defaultTool.name);
            }
          } else {
            //선택
            $(this).toggleClass('isSelected').siblings().removeClass('isSelected');
            var target = $(this).attr('class');
            target = target + ' isCurrent';
            
            options.siblings('.isCurrent').attr('class', target)
            options.siblings('.isCurrent').text($(this).text());
            options.removeClass('show');
          }
        })
      })

      //2023.08.09
      //지도 스크립트 - 2
      $('#pop_searchSetting').each(function() {
        var $this = $(this);
        var btn = $this.find('.btnSwiper button');
        
        btn.on('click', function(e){
          var target = $(e.target);
          var tabControl = target.attr('data-controls')
          var tab = target.closest('.btnSwiper');
          var tabWidth = $(window).innerWidth() / 3 ;

          var currentScrollY = target.closest('.layContent').scrollTop();
          var selectedBtn = $('#'+tabControl).offset().top;
          var fixedHeight = $('.btnSwiper').offset().top + $('.btnSwiper').outerHeight(true);
          var move;

          //메뉴 선택 시 가로 스크롤 이동
          tab
          .stop()
          .animate({
            scrollLeft: target.offset().left - tabWidth
          }, 400, $.easing.swing);

          if (currentScrollY == 0) {
            // console.log('시작이 0일때')
            move = $('#'+tabControl).offset().top - fixedHeight
          }else if(selectedBtn > 0) {
            // console.log('스크롤위치가 현재 선택된 버튼보다 클때')
            move = currentScrollY + Math.abs(selectedBtn) - fixedHeight
          } else if (selectedBtn < 0) {
            // console.log('스크롤위치가 현재 선택된 버튼보다 작을때')
            move = currentScrollY - Math.abs(selectedBtn) - fixedHeight
          }

          //메뉴 선택 시 해당 탭으로 세로 스크롤 이동
          target.closest('.layContent')
          .stop()
          .animate({
            scrollTop: move
          }, 300);
        })
      })

      $('header .btnSwiper').each(function() {
        var $this = $(this);
        var btn = $this.find('button');

        btn.on('click', function(e){
          $('#pop_searchSetting').css('display', 'block');
          
          var target = $(e.target);
          var tabWidth = $(window).innerWidth() / 3 ;
          var connectedTab = $('#'+target.attr('data-controls'))
          var connectedBtn;
          var fixedHeight = $('.btnSwiper').offset().top + $('.btnSwiper').outerHeight(true);

          $('.anchorTabFixed button').each(function(idx, el) {
            $(el).attr('data-controls') == target.attr('data-controls') ? connectedBtn = el : null
          })
          
          //메뉴 선택 시 가로 스크롤 이동
          $('.anchorTabFixed .btnSwiper')
          .stop()
          .animate({
            scrollLeft: connectedBtn.getBoundingClientRect().left - tabWidth
          }, 400, $.easing.swing);

          //메뉴 선택 시 해당 탭으로 세로 스크롤 이동
          
          $('.layContent').scrollTop(0);
          $('.layContent')
          .stop()
          .animate({
            scrollTop: connectedTab.offset().top - fixedHeight
          }, 0);
        })
      })

      //2023.08.09
      //관심 스크립트
      $('.tabWrap .tabType03').each(function() {
        var $this = $(this);
        var btn = $this.find('a');
        var selectedBtn;
        var tabWidth = $(window).innerWidth() / 3;

        //선택되어 있는 버튼으로 스크롤 활성화
        btn.each(function(idx, el) {
          $(el).attr('aria-selected') == "true" ? selectedBtn = el : null
        })

        $(this).stop().animate({scrollLeft: selectedBtn.getBoundingClientRect().left - tabWidth}, 0.1);
        
        btn.on('click', function(e){
          var target = $(e.target);
          var tab = target.closest('.tabType03');

          //메뉴 선택 시 가로 스크롤 이동
          tab.stop().animate({scrollLeft: target.offset().left - tabWidth}, 400, $.easing.swing);
        })
      })

      //2023.08.16
      //menuWrap 버튼 클릭 시 nav 나타나는 애니메이션
      $(etc.selector.menuWrap).each(function() {
        var btn = $(this).find('.btNav');
        var nav = btn.next();
        var closeBtn = nav.find('.closeMenu');

        //메뉴 버튼 클릭 시
        btn.off('click.etc').on('click.etc', function(){
          nav.css('display', 'block');
          nav.stop().animate({right: 0}, 300);
          btn.attr('aria-expanded', 'true');
          mvJs.utils.scrollDisabled();
        })
        
        //닫기 버튼 클릭 시
        closeBtn.off('click.etc').on('click.etc', function(){
          nav.stop().animate({
            right: '-100%'
          },
          {
            duration: 300,
            complete: function() {
              nav.css('display', 'none');
              btn.attr('aria-expanded', 'false');
              mvJs.utils.scrollEnabled();
            }
          }); 
        })
      })
    },
    init: function() {
      this.bind();
    }
  };

  // mvJs interface
  var mvJs = {
    // js 초기화
    init : common.handler.ready,
    utils: {
      //window 스크롤 비활성화
      scrollDisabled: utils.scrollDisabled,
      //window 스크롤 활성화
      scrollEnabled : utils.scrollEnabled,
      //dim 활성화
      dimmedShow    : utils.dimmedShow,
      //dim 비활성화
      dimmedHide    : utils.dimmedHide
    },
    swiper: {
      /**
       * 스와이프 업데이트
       * mvJs.swiper.update(target: jQuerySeletor)
       * target: 스와이프를 감싸고 있는 태그의 셀렉터
       * 스와이프 swiper-wrapper 안쪽 컨텐츠만 바뀌었을 때 실행
       * target의 자식으로 있는 스와이프를 update
       * mvJs.swiper.update($('.swiperWrap'))
       */
      update: mySwiper.methodes.swiperUpdate
    },
    popup: {
      /**
       * 팝업 show
       * mvJs.popup.show(target: jQuerySeletor)
       * target: 팝업 셀렉터
       * mvJs.popup.show($('.layer_popup'));
       */
      show: popup.methodes.show,
      /**
       * 팝업 hide
       * mvJs.popup.show(target: jQuerySeletor)
       * target: 팝업 셀렉터
       * mvJs.popup.hide($('.layer_popup'));
       */
      hide: popup.methodes.hide
    },
    ect: {
      /**
       * 리뷰 말줄임 시 더보기 버튼 및 이벤트 바인딩
       * mvJs.ect.reviewMoreBtn(target: jQuerySeletor)
       * target: 리뷰 리스트 셀렉터
       * mvJs.ect.reviewMoreBtn($('.reviewList'))
       */
      //pageAside: etc.methodes.pageAside
    }
  };
  window.mvJs = mvJs;
})(window.jQuery, window);
