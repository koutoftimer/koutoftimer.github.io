(function() {
    'use strict';

    angular
        .module('app', [
            'app.core',
            'app.home',
            'app.underground-mining',
            'app.office',
            'app.resources',
            'ui.router'
        ])
        .run(bindState)
        .config(configureRouter);

    bindState.$inject = ['$rootScope', '$state', '$stateParams'];

    function bindState($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }

    configureRouter.$inject = ['$locationProvider', '$urlRouterProvider'];

    function configureRouter($locationProvider, $urlRouterProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $urlRouterProvider
            .otherwise('/miner/');
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core', []);

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .service('levels', LevelsService);

    var levelConfig = {};

    LevelsService.$inject = ['$interval', 'resources'];

    function LevelsService($interval, resources) {
        var service = {
                addLevel: addLevel,
                getNewLevelCost: getNewLevelCost,
                levels: []
            };

        activate();

        return service;

        function activate() {
            service.addLevel();
            initLevelConfig();

            $interval(dig, 1000);

            function dig() {
                service.levels.forEach(function(level) {
                    level.workers.forEach(function(worker) {
                        resources.add(worker.dig());
                    });
                });
            }

            function initLevelConfig() {
                levelConfig.names = resources.getNames();

                levelConfig[1] = angular.extend(getNullChances(), {
                    coal: {
                        chance: 1,
                        quantity: 1
                    }
                });

                levelConfig[2] = angular.extend(getNullChances(), {
                    coal: {
                        chance: 0.95,
                        quantity: 2
                    },
                    iron: {
                        chance: 1,
                        quantity: 1
                    }
                });

                function getNullChances() {
                    var nullChance = {
                            chance: 0,
                            quantity: 0
                        },
                        nullChances = {};

                    levelConfig.names.forEach(function(name) {
                        nullChances[name] = nullChance;
                    });

                    return nullChances;
                }
            }
        }

        function addLevel() {
            service.levels.push(new Level(service.levels.length + 1));
        }

        function getNewLevelCost() {
            return Math.pow(60, service.levels.length);
        }

    }

    function Level(depth) {
        var level = this;

        level.depth = depth;
        level.workers = [];
    }

    Level.prototype.addWorker = levelAddWorker;
    Level.prototype.dig = levelDig;
    Level.prototype.getNewWorkerCost = levelGetNewWorkerCost;

    function Worker(depth) {
        var worker = this;

        worker.depth = depth;
    }

    Worker.prototype.dig = workerDig;

    function dig(depth) {
        var config = levelConfig[depth];

        for (var i = 0; i < levelConfig.names.length; ++i) {
            var resourceName = levelConfig.names[i];
            if (Math.random() < config[resourceName].chance) {
                var result = {};
                result[resourceName] = config[resourceName].quantity;
                return result;
            }
        }
    }

    function levelAddWorker() {
        var level = this;
        level.workers.push(new Worker(level.depth));
    }

    function levelDig() {
        var level = this;
        return dig(level.depth);
    }

    function levelGetNewWorkerCost() {
        var level = this;
        return Math.pow(10, level.depth) * Math.pow(1.4, level.workers.length);
    }

    function workerDig() {
        return dig(this.depth);
    }

})();

(function() {
    'use strict';

    angular
        .module('app.core')
        .service('resources', ResourcesService);

    var resourceConfig = {
            coal: {
                name: 'Coal',
                cost: 1
            },
            iron: {
                name: 'Iron',
                cost: Math.pow(5, 1)
            },
            tin: {
                name: 'Tin',
                cost: Math.pow(5, 2)
            },
            copper: {
                name: 'Copper',
                cost: Math.pow(5, 3)
            },
            silver: {
                name: 'Silver',
                cost: Math.pow(5, 4)
            },
            gold: {
                name: 'Gold',
                cost: Math.pow(5, 5)
            }
        },
        resourcesNames = [];

    activateResourcesNames();


    function ResourcesService() {
        var service = new ResourcesList();

        activate();

        return service;

        function activate() {
            service.cash = 0;
        }
    }

    ResourcesService.prototype.ResourcesList = ResourcesList;


    function ResourcesList(values) {
        var resourcesList = this;

        activate();

        return resourcesList;

        function activate() {
            resourcesNames.forEach(function(name) {
                resourcesList[name] = 0;
            });
            resourcesList.add(values);
        }
    }

    ResourcesList.prototype.add = addResources;
    ResourcesList.prototype.getConfig = getResourceConfig;
    ResourcesList.prototype.getCost = getResourceCost;
    ResourcesList.prototype.getNames = getResourcesNames;


    function activateResourcesNames() {
        Object.keys(resourceConfig).forEach(function(name) {
            resourcesNames.push(name);
        });
    }

    function addResources(resourcesList) {
        if (!resourcesList) {
            return;
        }

        var keys = Object.keys(resourcesList),
            self = this;

        resourcesNames.forEach(function(name) {
            if (keys.indexOf(name) != -1) {
                self[name] += resourcesList[name];
            }
        });
    }

    function getResourceConfig() {
        return angular.copy(resourceConfig);
    }

    function getResourceCost(name) {
        return this[name] * resourceConfig[name].cost;
    }

    function getResourcesNames() {
        return angular.copy(resourcesNames);
    }

})();

(function() {
    'use strict';

    angular
        .module('app.home', [
            'app.core',
            'app.office',
            'app.resources',
            'ui.router'
        ])
        .config(ConfigureHome);

    ConfigureHome.$inject = ['$stateProvider'];

    function ConfigureHome($stateProvider) {
        var mine = {
            name: 'home',
            templateUrl: '/js/app/home/home.template.html',
            title: 'Mine',
            url: '/miner/'
        };

        $stateProvider
            .state(mine)
    }
})();

(function() {
    'use strict';

    angular
        .module('app.office', [
            'app.core',
            'ui.router'
        ])
        .config(ConfigureOffice);

    ConfigureOffice.$inject = ['$stateProvider', '$urlRouterProvider'];

    function ConfigureOffice($stateProvider) {
        var officeSell = {
                name: 'sell-center',
                templateUrl: 'js/app/office/sell/sell.template.html',
                title: 'Sell center',
                url: '/miner/sell'
            },
            officeEmployee = {
                name: 'employee-center',
                templateUrl: 'js/app/office/employee/employee.template.html',
                title: 'Employee center',
                url: '/miner/employee'
            },
            officeUpgrade = {
                name: 'upgrade-center',
                templateUrl: 'js/app/office/upgrade/upgrade.template.html',
                title: 'Upgrade center',
                url: '/miner/upgrade'
            };

        $stateProvider
            .state(officeSell)
            .state(officeEmployee)
            .state(officeUpgrade)
    }
})();

(function() {
    'use strict';

    angular
        .module('app.office')
        .controller('EmployeeCenterController', EmployeeCenterController);

    EmployeeCenterController.$inject = ['resources', 'levels'];

    function EmployeeCenterController(resources, levels) {
        var employeeCenter = this;
        
        employeeCenter.canHire = canHire;
        employeeCenter.hireWorker = hireWorker;
        employeeCenter.levels = levels;

        function canHire(level) {
            return level.getNewWorkerCost() <= resources.cash;
        }

        function hireWorker(level) {
            resources.cash -= level.getNewWorkerCost();
            level.addWorker();
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.office')
        .directive('mnrEmployeeCenter', EmployeeCenter);

    EmployeeCenter.$inject = [];

    function EmployeeCenter(controller) {
        var directive = {
            bindToController: true,
            controller: 'EmployeeCenterController',
            controllerAs: 'employeeCenter',
            restrict: 'EA',
            templateUrl: 'js/app/office/employee/employee-center.directive.html'
        };

        return directive;
    }
})();


(function() {
    'use strict';

    angular
        .module('app.office')
        .controller('SellCenterController', SellCenterController);

    SellCenterController.$inject = ['resources'];

    function SellCenterController(resources) {
        var sellCenter = this;
        
        sellCenter.resources = resources;
        sellCenter.sell = sellResource;

        function sellResource(name) {
            resources.cash += resources.getCost(name);
            resources[name] = 0;
        }
    }
})();


(function() {
    'use strict';

    angular
        .module('app.office')
        .directive('mnrSellCenter', SellCenterDirective);

    SellCenterDirective.$inject = [];

    function SellCenterDirective(controller) {
        var directive = {
            bindToController: true,
            controller: 'SellCenterController',
            controllerAs: 'sellCenter',
            restrict: 'EA',
            templateUrl: 'js/app/office/sell/sell-center.directive.html'
        };

        return directive;
    }
})();


(function() {
    'use strict';

    angular
        .module('app.office')
        .controller('UpgradeCenterController', UpgradeCenterController);

    UpgradeCenterController.$inject = ['resources', 'levels'];

    function UpgradeCenterController(resources, levels) {
        var upgradeCenter = this;
        
        upgradeCenter.addLevel = addLevel;
        upgradeCenter.canAddLevel = canAddLevel;
        upgradeCenter.levels = levels;

        function addLevel() {
            resources.cash -= levels.getNewLevelCost();
            levels.addLevel();
        }

        function canAddLevel() {
            return levels.getNewLevelCost() <= resources.cash;
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.office')
        .directive('mnrUpgradeCenter', UpgradeCenterDirective);

    UpgradeCenterDirective.$inject = [];

    function UpgradeCenterDirective(controller) {
        var directive = {
            bindToController: true,
            controller: 'UpgradeCenterController',
            controllerAs: 'upgradeCenter',
            restrict: 'EA',
            templateUrl: 'js/app/office/upgrade/upgrade-center.directive.html'
        };

        return directive;
    }
})();

(function() {
    'use strict';

    angular
        .module('app.resources', [
            'app.core'
        ]);

})();

(function() {
    'use strict';

    angular
        .module('app.resources')
        .controller('InlineResourcesController', InlineResourcesController);

    InlineResourcesController.$inject = ['resources'];

    function InlineResourcesController(resources) {
        var header = this;
        
        header.resources = resources;
    }
})();

(function() {
    'use strict';

    angular
        .module('app.resources')
        .directive('mnrInlineResources', InlineResourcesDirective);

    InlineResourcesDirective.$inject = [];

    function InlineResourcesDirective() {
        var directive = {
            bindToController: true,
            controller: 'InlineResourcesController',
            controllerAs: 'inline',
            restrict: 'EA',
            templateUrl: 'js/app/resources/inline.directive.html'
        };

        return directive;
    }
})();

(function() {
    'use strict';

    angular
        .module('app.underground-mining', [
            'app.core'
        ])

})();

(function() {
    'use strict';

    angular
        .module('app.underground-mining')
        .controller('MineController', MineController);

    MineController.$inject = ['resources', 'levels'];

    function MineController(resources, levels) {
        var mine = this;
        
        mine.dig = dig;
        mine.levels = levels;
        mine.resources = resources;

        function dig(level) {
            resources.add(level.dig());
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.underground-mining')
        .directive('mnrMine', MineDirective);

    MineDirective.$inject = [];

    function MineDirective() {
        var directive = {
            bindToController: true,
            controller: 'MineController',
            controllerAs: 'mine',
            restrict: 'EA',
            templateUrl: '/js/app/underground-mining/mine.directive.html'
        };

        return directive;
    }
})();
