var Triarc;
(function (Triarc) {
    var Web;
    (function (Web) {
        var mod = angular.module('tlContinuousScroll', []);
        var ContinuousScrollController = (function () {
            function ContinuousScrollController($scope) {
                this.$scope = $scope;
                this.init();
            }
            ContinuousScrollController.prototype.init = function () {
                var _this = this;
                this.currentCancellationToken = {
                    isCancelRequested: false
                };
                this.$scope.$watch(function (scope) { return scope.config() ? scope.config().searchArg : undefined; }, function () {
                    _this.reload();
                });
            };
            ContinuousScrollController.prototype.search = function () {
                var _this = this;
                this.$scope.config().searchArg.skip = this.$scope.config().items.length;
                this.$scope.config().searchArg.take = this.$scope.config().searchLimit + 1;
                var requestCancellationToken = this.currentCancellationToken;
                return this.$scope.config().searchFn({ arg: this.$scope.config().searchArg }).then(function (items) {
                    if (requestCancellationToken.isCancelRequested)
                        return false;
                    _this.loaded = true;
                    _this.$scope.config().items.addRange(items.toEnumerable().take(_this.$scope.config().searchLimit).toArray());
                    return items.length > _this.$scope.config().searchLimit;
                });
            };
            ContinuousScrollController.prototype.reload = function () {
                this.currentCancellationToken.isCancelRequested = true;
                this.currentCancellationToken = {
                    isCancelRequested: false
                };
                this.loaded = false;
                this.isScrolling = false;
                this.$scope.config().items = [];
                this.recursiveSearch();
            };
            ContinuousScrollController.prototype.recursiveSearch = function () {
                var _this = this;
                this.search().then(function (hasMore) {
                    if (!_this.isScrolling && hasMore) {
                        _this.recursiveSearch();
                    }
                });
            };
            ContinuousScrollController.controllerId = "ContinuousScrollController";
            ContinuousScrollController.$inject = [
                "$scope"
            ];
            return ContinuousScrollController;
        }());
        Web.ContinuousScrollController = ContinuousScrollController;
        mod.controller(ContinuousScrollController.controllerId, ContinuousScrollController);
        mod.directive("tlContinuousScroll", function () {
            return {
                restrict: "E",
                replace: true,
                transclude: true,
                controller: ContinuousScrollController.controllerId,
                controllerAs: "scrollCtrl",
                templateUrl: "tlContinuousScroll/continuousScroll.html",
                scope: {
                    config: "&"
                }
            };
        });
    })(Web = Triarc.Web || (Triarc.Web = {}));
})(Triarc || (Triarc = {}));

angular.module('tlContinuousScroll').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('tlContinuousScroll/continuousScroll.html',
    "<div tl-full-height><div tl-when-scrolled=\"scrollCtrl.search()\" tl-has-scroll-content=\"scrollCtrl.isScrolling\" style=\"overflow-x: hidden; height: 100%\"><div ng-transclude></div><ng-include src=\"config().noItemTemplate\" ng-if=\"scrollCtrl.loaded && config().items.length === 0\"></ng-include><div class=\"text-center\" ng-if=\"!scrollCtrl.loaded && config().items.length === 0\">{{'_loading' | translate }}...</div></div></div>"
  );

}]);
