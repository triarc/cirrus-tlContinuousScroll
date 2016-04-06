declare module Triarc.Web {
    interface IContinuousScrollSearchArg {
        skip: number;
        take: number;
    }
    interface IContinuousScrollConfig<TSearchArg extends IContinuousScrollSearchArg> {
        searchLimit: number;
        items: any[];
        searchArg: TSearchArg;
        searchFn({arg: TSearchArg}: {
            arg: any;
        }): angular.IPromise<any[]>;
        noItemTemplate: string;
    }
    interface IContinuousScrollScope extends angular.IScope {
        config(): IContinuousScrollConfig<any>;
    }
    class ContinuousScrollController {
        protected $scope: IContinuousScrollScope;
        static controllerId: string;
        static $inject: string[];
        private isScrolling;
        private loaded;
        private currentCancellationToken;
        constructor($scope: IContinuousScrollScope);
        init(): void;
        search(): ng.IPromise<boolean>;
        reload(): void;
        recursiveSearch(): void;
    }
}
