/* eslint-env mocha */

const expect = chai.expect
const log = console.log.bind(console)
// console.log(chai, expect)

describe('Wombat setup', function () {
  before(async function () {
    let wombatIf = await window.wombatTestUtil.addWombatSandbox()
    /**
     * @type {{window: Window | null, document: Document | null}}
     */
    this.wombatSandbox = {
      window: wombatIf.contentWindow,
      document: wombatIf.contentDocument
    }

    const testSelf = this
    this._$internalHelper = {
      validTestTitles: {
        '"before all" hook': true,
        '"before" hook': true
      },
      checkValidCall () {
        if (!this.validTestTitles[testSelf.test.title]) {
          throw new Error(`Invalid usage of internal helpers at ${testSelf.test.title}`)
        }
      },
      async refresh () {
        this.checkValidCall()
        wombatIf = await window.wombatTestUtil.refreshSandbox()
        testSelf.wombatSandbox.window = wombatIf.contentWindow
        testSelf.wombatSandbox.document = wombatIf.contentDocument
      },
      async refreshInit () {
        await this.refresh()
        this.init()
      },
      init () {
        testSelf.wombatSandbox.window._WBWombat(testSelf.wombatSandbox.window, testSelf.wombatSandbox.window.wbinfo)
      }
    }
  })

  describe('before initialization', function () {
    it('should put _WBWombat on window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.have.property('_WBWombat').that.is.a('function', '_WBWombat should be placed on window before initialization and should be a function')
    })

    it('should not add __WB_replay_top to window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('__WB_replay_top', '__WB_replay_top should not exist on window')
    })

    it('should not add _WB_wombat_location to window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('_WB_wombat_location', '_WB_wombat_location should not exist on window')
    })

    it('should not add WB_wombat_location to window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('WB_wombat_location', 'WB_wombat_location should not exist on window')
    })

    it('should not add __WB_check_loc to window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('__WB_check_loc', '__WB_check_loc should not exist on window')
    })

    it('should not add __orig_postMessage property on window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('__orig_postMessage', '__orig_postMessage should not exist on window')
    })

    it('should not add __WB_replay_top to window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('__WB_replay_top', '__WB_replay_top should not exist on window')
    })

    it('should not add __WB_top_frame to window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('__WB_top_frame', '__WB_top_frame should not exist on window')
    })

    it('should not add __wb_Date_now to window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('__wb_Date_now', '__wb_Date_now should not exist on window')
    })

    it('should not expose CustomStorage', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('CustomStorage', 'CustomStorage should not exist on window')
    })

    it('should not expose FuncMap', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('FuncMap', 'FuncMap should not exist on window')
    })

    it('should not expose SameOriginListener', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('SameOriginListener', 'SameOriginListener should not exist on window')
    })

    it('should not expose WrappedListener', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('WrappedListener', 'WrappedListener should not exist on window')
    })

    it('should not add the __WB_pmw property to Object.prototype', function () {
      const {window} = this.wombatSandbox
      expect(window.Object.prototype.__WB_pmw).to.equal(undefined, 'Object.prototype.__WB_pmw should be undefined')
    })

    it('should not add the WB_wombat_top property to Object.prototype', function () {
      const {window} = this.wombatSandbox
      expect(window.Object.prototype.WB_wombat_top).to.equal(undefined, 'Object.prototype.WB_wombat_top should be undefined')
      expect(window.Object).to.not.have.own.property('WB_wombat_top')
    })

    it('should not have patched Element.prototype.insertAdjacentHTML', function () {
      const { window } = this.wombatSandbox
      const elementProto = window.Element.prototype
      expect(elementProto.insertAdjacentHTML.toString()).to.equal('function insertAdjacentHTML() { [native code] }', 'Element.prototype.insertAdjacentHTML should not have been patched')
    })
  })

  describe('initialization', function () {
    it('should not be possible using the function Wombat a constructor', function () {
      const {window} = this.wombatSandbox
      expect(() => new window.Wombat(window, window.wbinfo)).to.throw(TypeError, 'window.Wombat is not a constructor')
    })

    it('should not be possible by invoking the function Wombat', function () {
      const {window} = this.wombatSandbox
      expect(() => window.Wombat(window, window.wbinfo)).to.throw(TypeError, 'window.Wombat is not a function')
    })

    describe('using _WBWombat as a plain function', function () {
      beforeEach(async function () {
        await this._$internalHelper.refresh()
      })

      it('should not throw an error', function () {
        const {window} = this.wombatSandbox
        expect(() => window._WBWombat(window, window.wbinfo)).to.not.throw(TypeError, 'window._WBWombat is not a function')
      })

      it('should return an object containing the exposed functions', function () {
        const {window} = this.wombatSandbox
        expect(window._WBWombat(window, window.wbinfo)).to.have.interface({
          extract_orig: Function,
          rewrite_url: Function,
          watch_elem: Function,
          init_new_window_wombat: Function,
          init_paths: Function,
          local_init: Function,
        })
      })

      it('should add the property _wb_wombat to the window which is an object containing the exposed functions', function () {
        const {window} = this.wombatSandbox
        window._WBWombat(window, window.wbinfo)
        expect(window._wb_wombat).to.have.interface({
          extract_orig: Function,
          rewrite_url: Function,
          watch_elem: Function,
          init_new_window_wombat: Function,
          init_paths: Function,
          local_init: Function,
        })
      })
    })

    describe('using _WBWombat as a constructor', function () {
      beforeEach(async function () {
        await this._$internalHelper.refresh()
      })

      it('should not throw an error', function () {
        const {window} = this.wombatSandbox
        expect(() => new window._WBWombat(window, window.wbinfo)).to.not.throw(TypeError, 'window._WBWombat is not a constructor')
      })

      it('should return an object containing the exposed functions', function () {
        const {window} = this.wombatSandbox
        expect(new window._WBWombat(window, window.wbinfo)).to.have.interface({
          extract_orig: Function,
          rewrite_url: Function,
          watch_elem: Function,
          init_new_window_wombat: Function,
          init_paths: Function,
          local_init: Function,
        })
      })

      it('should add the property _wb_wombat to the window which is an object containing the exposed functions', function () {
        const {window} = this.wombatSandbox
        const ignored = new window._WBWombat(window, window.wbinfo)
        expect(window._wb_wombat).to.have.interface({
          extract_orig: Function,
          rewrite_url: Function,
          watch_elem: Function,
          init_new_window_wombat: Function,
          init_paths: Function,
          local_init: Function,
        })
      })
    })
  })

  describe.only('after initialization', function () {
    before('wombatSetupAfterInitialization', async function () {
      // await this._$internalHelper.refreshInit()
      this._$internalHelper.init()
    })

    it('should not have removed _WBWombat from window', function () {
      const {window} = this.wombatSandbox
      expect(window._WBWombat).to.be.a('function')
    })

    it('should add the property __WB_replay_top to window that is equal to the same window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.have.property('__WB_replay_top').that.is.equal(window)
    })

    it('should add the property __WB_orig_parent to window when it is the top replayed page', function () {
      const replayWindow = this.wombatSandbox.window
      expect(replayWindow).to.have.property('__WB_orig_parent').that.is.equal(window, '__WB_orig_parent should be added when it is the top replayed page and it should be our window')
    })

    it('should not define the property __WB_top_frame when it is the top replayed page', function () {
      const {window} = this.wombatSandbox
      expect(window).to.have.property('__WB_top_frame').that.is.equal(undefined, '__WB_top_frame not defined when it is the top replayed page and it should be our window')
    })

    it('should define the WB_wombat_top property on Object.prototype', function () {
      const {window} = this.wombatSandbox
      expect(window.Object.prototype)
      .to.have.ownPropertyDescriptor('WB_wombat_top')
      .that.has.interface({
        configurable: Boolean,
        enumerable: Boolean,
        get: Function,
        set: Function,
      })
    })

    it('should not expose WombatLocation on window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.not.have.property('WombatLocation', 'WombatLocation should not be exposed directly')
    })

    it('should add the _WB_wombat_location property to window', function () {
      const {window} = this.wombatSandbox
      expect(window).to.have.property('_WB_wombat_location').that.is.a('object', '_WB_wombat_location should be added a property of window')
    })

    it('should override the appropriate history functions', function () {
      const {window} = this.wombatSandbox
      expect(window.history).to.have.interface({
        pushState: Function,
        _orig_pushState: Function,
        replaceState: Function,
        _orig_replaceState: Function,
      })
    })

    it('should update document.title property descriptor the appropriate history functions', function () {
      const {document} = this.wombatSandbox
      expect(document).to.have.ownPropertyDescriptor('title')
      .that.has.interface({
        configurable: Boolean,
        enumerable: Boolean,
        get: Function,
        set: Function,
      })
    })

    it('should apply override to window.postMessage', function () {
      const {window} = this.wombatSandbox
      expect(window).to.have.property('postMessage').that.is.a('function')
      expect(window.postMessage.toString()).to.not.have.string('[native code]')
    })

    it('should apply override to Window.prototype.postMessage', function () {
      const {window} = this.wombatSandbox
      expect(window.Window.prototype).to.have.own.property('postMessage').that.is.a('function')
      expect(window.Window.prototype.postMessage.toString()).to.not.have.string('[native code]')
    })

    it('should persist the original window.postMessage as __orig_postMessage', function () {
      const {window} = this.wombatSandbox
      expect(window).to.have.property('__orig_postMessage').that.is.a('function')
      expect(window.__orig_postMessage.toString()).to.have.string('[native code]')
    })

    it('should apply override to EventTarget.addEventListener', function () {
      const {window} = this.wombatSandbox
      expect(window.EventTarget.prototype).to.have.own.property('addEventListener').that.is.a('function')
      expect(window.EventTarget.prototype.addEventListener.toString()).not.have.string('[native code]')
    })

    it('should apply override to EventTarget.removeEventListener', function () {
      const {window} = this.wombatSandbox
      expect(window.EventTarget.prototype).to.have.own.property('removeEventListener').that.is.a('function')
      expect(window.EventTarget.prototype.removeEventListener.toString()).not.have.string('[native code]')
    })

    for(const fn of window.setupAfter.Document.fn) {
      it(`should apply override to document.${fn}`, function () {
        const {document} = this.wombatSandbox
        expect(document).to.have.property(fn).that.is.a('function')
        expect(document[fn].toString()).not.have.string('[native code]')
      })

      it(`should apply override to Document.${fn}`, function () {
        const {window} = this.wombatSandbox
        expect(window.Document.prototype).to.have.own.property(fn).that.is.a('function')
        expect(window.Document.prototype[fn].toString()).not.have.string('[native code]')
      })
    }

    it('should apply override to XMLHttpRequest.open', function () {
      const {window} = this.wombatSandbox
      expect(window.XMLHttpRequest.prototype).to.have.own.property('open').that.is.a('function')
      expect(window.XMLHttpRequest.prototype.open.toString()).not.have.string('[native code]')
    })

    it('should apply override to window.fetch', function () {
      const {window} = this.wombatSandbox
      expect(window).to.have.property('fetch').that.is.a('function')
      expect(window.fetch.toString()).not.have.string('[native code]')
    })

    it('should apply override to window.Request', function () {
      const wombatWindow = this.wombatSandbox.window
      expect(wombatWindow).to.have.property('Request').that.is.a('function')
      expect(wombatWindow.Request.toString()).not.equal(window.Request.toString())
      expect(wombatWindow.Request.prototype.toString()).equal(window.Request.prototype.toString())
    })

    it('should apply override to window.Audio', function () {
      const wombatWindow = this.wombatSandbox.window
      expect(wombatWindow).to.have.property('Audio').that.is.a('function')
      expect(wombatWindow.Audio.toString()).not.equal(window.Audio.toString())
      expect(wombatWindow.Audio.prototype.toString()).equal(window.Audio.prototype.toString())
      expect(wombatWindow.Audio.prototype).to.have.ownPropertyDescriptor('constructor').that.has.property('value', wombatWindow.Audio)
    })

    it('should apply override to window.Worker', function () {
      const wombatWindow = this.wombatSandbox.window
      expect(wombatWindow).to.have.property('Worker').that.is.a('function')
      expect(wombatWindow.Worker.toString()).not.equal(window.Worker.toString())
      expect(wombatWindow.Worker.prototype.toString()).equal(window.Worker.prototype.toString())
    })

    it('should apply override to ServiceWorkerContainer.register', function () {
      const wombatWindow = this.wombatSandbox.window
      expect(wombatWindow.ServiceWorkerContainer.prototype).to.have.own.property('register').that.is.a('function')
      expect(wombatWindow.ServiceWorkerContainer.prototype.register.toString()).not.equal(window.ServiceWorkerContainer.prototype.register.toString())
      expect(wombatWindow.navigator.serviceWorker.register.toString()).not.equal(window.navigator.serviceWorker.register.toString())
    })

    it(`should apply override to Element.insertAdjacentHTML`, function () {
      const wombatWindow = this.wombatSandbox.window
      expect(wombatWindow.Element.prototype).to.have.property('insertAdjacentHTML').that.is.a('function')
      expect(wombatWindow.Element.prototype.insertAdjacentHTML.toString()).to.not.equal(window.Element.prototype.insertAdjacentHTML.toString())
    })

    for(const eto of window.setupAfter.MessageEvent) {
      it(`should update MessageEvent.${eto} property descriptor`, function () {
        const {window} = this.wombatSandbox
        expect(window.MessageEvent.prototype).to.have.ownPropertyDescriptor(eto)
        .that.has.interface({
          configurable: Boolean,
          enumerable: Boolean,
          get: Function,
        })
      })
    }

    for(const [iface, props] of Object.entries(window.setupAfter.override_html_assign)) {
      for (let i = 0; i < props.length; ++i) {
        let prop = props[i]
        it(`should update ${iface}.${prop} property descriptor`, function () {
          const {window} = this.wombatSandbox
          expect(window[iface].prototype)
          .to.have.ownPropertyDescriptor(prop)
          .that.has.interface({
            configurable: Boolean,
            enumerable: Boolean,
            get: Function,
            set: Function,
          })
        })
      }
    }

    for(const prop of window.setupAfter.Document.props) {
      it(`should update Document.${prop} property descriptor`, function () {
        const wombatWindow = this.wombatSandbox.window
        expect(wombatWindow.Document.prototype)
        .to.have.ownPropertyDescriptor(prop)
        .that.has.interface({
          configurable: Boolean,
          enumerable: Boolean,
          get: Function,
        })
        const wombatPD = wombatWindow.Reflect.getOwnPropertyDescriptor(wombatWindow.Document.prototype, prop)
        const orginalPD = Reflect.getOwnPropertyDescriptor(window.Document.prototype, prop)
        expect(wombatPD.get.toString()).not.equal(orginalPD.get.toString())
      })
    }

    it(`should update Node.baseURI property descriptor`, function () {
      const wombatWindow = this.wombatSandbox.window
      expect(wombatWindow.Node.prototype)
      .to.have.ownPropertyDescriptor('baseURI')
      .that.has.interface({
        configurable: Boolean,
        enumerable: Boolean,
        get: Function,
      })
      const wombatPD = wombatWindow.Reflect.getOwnPropertyDescriptor(wombatWindow.Node.prototype, 'baseURI')
      const orginalPD = Reflect.getOwnPropertyDescriptor(window.Node.prototype, 'baseURI')
      expect(wombatPD.get.toString()).not.equal(orginalPD.get.toString())
    })

    for(const prop of window.setupAfter.Attr) {
      it(`should update Attr.${prop} property descriptor`, function () {
        const {window} = this.wombatSandbox
        const wombatPD = window.Reflect.getOwnPropertyDescriptor(window.Attr.prototype, prop)
        expect(wombatPD).to.have.property('get').that.is.a('function')
        expect(wombatPD.get.toString()).to.have.string('wombat')
      })
    }

  })
})