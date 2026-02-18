
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-900">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.jsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=0f286430"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=0f286430"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react;
import { Route, Routes, BrowserRouter as Router } from "/node_modules/.vite/deps/react-router-dom.js?v=0f286430";
import ScrollToTop from "/src/components/ScrollToTop.jsx";
import Header from "/src/components/Header.jsx";
import Footer from "/src/components/Footer.jsx";
import HomePage from "/src/pages/HomePage.jsx";
function App() {
  return /* @__PURE__ */ jsxDEV(Router, { children: [
    /* @__PURE__ */ jsxDEV(ScrollToTop, {}, void 0, false, {
      fileName: "/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx",
      lineNumber: 12,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-slate-900", children: [
      /* @__PURE__ */ jsxDEV(Header, {}, void 0, false, {
        fileName: "/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx",
        lineNumber: 14,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Routes, { children: /* @__PURE__ */ jsxDEV(Route, { path: "/", element: /* @__PURE__ */ jsxDEV(HomePage, {}, void 0, false, {
        fileName: "/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx",
        lineNumber: 16,
        columnNumber: 36
      }, this) }, void 0, false, {
        fileName: "/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx",
        lineNumber: 16,
        columnNumber: 11
      }, this) }, void 0, false, {
        fileName: "/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx",
        lineNumber: 15,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Footer, {}, void 0, false, {
        fileName: "/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx",
        lineNumber: 18,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx",
      lineNumber: 13,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx",
    lineNumber: 11,
    columnNumber: 5
  }, this);
}
_c = App;
export default App;
var _c;
$RefreshReg$(_c, "App");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/App.jsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBV007QUFWTixPQUFPQSxXQUFXO0FBQ2xCLFNBQVNDLE9BQU9DLFFBQVFDLGlCQUFpQkMsY0FBYztBQUN2RCxPQUFPQyxpQkFBaUI7QUFDeEIsT0FBT0MsWUFBWTtBQUNuQixPQUFPQyxZQUFZO0FBQ25CLE9BQU9DLGNBQWM7QUFFckIsU0FBU0MsTUFBTTtBQUNiLFNBQ0UsdUJBQUMsVUFDQztBQUFBLDJCQUFDLGlCQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBWTtBQUFBLElBQ1osdUJBQUMsU0FBSSxXQUFVLDZCQUNiO0FBQUEsNkJBQUMsWUFBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQU87QUFBQSxNQUNQLHVCQUFDLFVBQ0MsaUNBQUMsU0FBTSxNQUFLLEtBQUksU0FBUyx1QkFBQyxjQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBUyxLQUFsQztBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQXNDLEtBRHhDO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFFQTtBQUFBLE1BQ0EsdUJBQUMsWUFBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQU87QUFBQSxTQUxUO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FNQTtBQUFBLE9BUkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQVNBO0FBRUo7QUFBQ0MsS0FiUUQ7QUFlVCxlQUFlQTtBQUFJLElBQUFDO0FBQUEsYUFBQUEsSUFBQSIsIm5hbWVzIjpbIlJlYWN0IiwiUm91dGUiLCJSb3V0ZXMiLCJCcm93c2VyUm91dGVyIiwiUm91dGVyIiwiU2Nyb2xsVG9Ub3AiLCJIZWFkZXIiLCJGb290ZXIiLCJIb21lUGFnZSIsIkFwcCIsIl9jIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkFwcC5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgUm91dGUsIFJvdXRlcywgQnJvd3NlclJvdXRlciBhcyBSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCBTY3JvbGxUb1RvcCBmcm9tICcuL2NvbXBvbmVudHMvU2Nyb2xsVG9Ub3AnO1xuaW1wb3J0IEhlYWRlciBmcm9tICdAL2NvbXBvbmVudHMvSGVhZGVyLmpzeCc7XG5pbXBvcnQgRm9vdGVyIGZyb20gJ0AvY29tcG9uZW50cy9Gb290ZXIuanN4JztcbmltcG9ydCBIb21lUGFnZSBmcm9tICcuL3BhZ2VzL0hvbWVQYWdlJztcblxuZnVuY3Rpb24gQXBwKCkge1xuICByZXR1cm4gKFxuICAgIDxSb3V0ZXI+XG4gICAgICA8U2Nyb2xsVG9Ub3AgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGJnLXNsYXRlLTkwMFwiPlxuICAgICAgICA8SGVhZGVyIC8+XG4gICAgICAgIDxSb3V0ZXM+XG4gICAgICAgICAgPFJvdXRlIHBhdGg9XCIvXCIgZWxlbWVudD17PEhvbWVQYWdlIC8+fSAvPlxuICAgICAgICA8L1JvdXRlcz5cbiAgICAgICAgPEZvb3RlciAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9Sb3V0ZXI+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcbiJdLCJmaWxlIjoiL2hvbWUvdTg4NDgyNzIxMC93ZWJzaXRlcy9PWmxXTzNnYUEvcHVibGljX2h0bWwvYXBwcy93ZWIvc3JjL0FwcC5qc3gifQ==
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
	<App />
);
import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=0f286430";
const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=0f286430";
const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react;
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=0f286430";
const ReactDOM = __vite__cjsImport2_reactDom_client.__esModule ? __vite__cjsImport2_reactDom_client.default : __vite__cjsImport2_reactDom_client;
import App from "/src/App.jsx";
import "/src/index.css";
ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */
jsxDEV(App, {}, void 0, false, {
    fileName: "/home/u884827210/websites/OZlWO3gaA/public_html/apps/web/src/main.jsx",
    lineNumber: 7,
    columnNumber: 3
}, this));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBTUM7QUFORCxPQUFPQSxXQUFXO0FBQ2xCLE9BQU9DLGNBQWM7QUFDckIsT0FBT0MsU0FBUztBQUNoQixPQUFPO0FBRVBELFNBQVNFLFdBQVdDLFNBQVNDLGVBQWUsTUFBTSxDQUFDLEVBQUVDO0FBQUFBLEVBQ3BELHVCQUFDLFNBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUFJO0FBQ0wiLCJuYW1lcyI6WyJSZWFjdCIsIlJlYWN0RE9NIiwiQXBwIiwiY3JlYXRlUm9vdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsibWFpbi5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20vY2xpZW50JztcbmltcG9ydCBBcHAgZnJvbSAnQC9BcHAnO1xuaW1wb3J0ICdAL2luZGV4LmNzcyc7XG5cblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSkucmVuZGVyKFxuXHQ8QXBwIC8+XG4pO1xuIl0sImZpbGUiOiIvaG9tZS91ODg0ODI3MjEwL3dlYnNpdGVzL09abFdPM2dhQS9wdWJsaWNfaHRtbC9hcHBzL3dlYi9zcmMvbWFpbi5qc3gifQ==
