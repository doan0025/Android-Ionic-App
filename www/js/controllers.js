angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, LocalStorageService) {
    // Form login
    $scope.loginData = {};

    // Create the login modal 
    $ionicModal.fromTemplateUrl('templates/settings.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Close the login modal
    $scope.closeSettings = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.showSettings = function () {
        $scope.modal.show();
    };

    //Initialize local storage for vibration
    if (LocalStorageService.getStorageList("task-vibe")) {
        $scope.vibe = LocalStorageService.getStorageList("task-vibe");
    } else {
        $scope.vibe = {
            isChecked: false
        };
        $scope.checkVibe = function () {
            LocalStorageService.setStorageList("task-vibe", $scope.vibe);
        }
    }

    //Initialize local storage for notifications
    if (LocalStorageService.getStorageList("task-notify")) {
        $scope.notify = LocalStorageService.getStorageList("task-notify");
    } else {
        $scope.notify = {
            isChecked: false
        };
        $scope.checkNotify = function () {
            LocalStorageService.setStorageList("task-notify", $scope.notify);
        }
    }
})

.controller('TaskCtrl', function ($scope, $ionicModal, $rootScope, LocalStorageService, $cordovaVibration, $cordovaLocalNotification, filterFilter) {
    if (LocalStorageService.getStorageList("task-1")) {
        $scope.tasks = LocalStorageService.getStorageList("task-1");
    } else {
        $scope.tasks = [
            {
                Name: "What is Ionic, and where does it fit?",
                isChecked: true
            },
            {
                Name: "Why did we build Ionic?",
                isChecked: false
            },
            {
                Name: "Building Hybrid Apps With Ionic",
                isChecked: false
            },
            {
                Name: "Get building!",
                isChecked: false
            },
            {
                Name: "Platform notes",
                isChecked: false
            }
        ];
        LocalStorageService.setStorageList("task-1", $scope.tasks);

    };
    // Create the login modal that we will use later

    //Add new items to the list and sync localstorage
    $scope.submitForm = function () {
        $scope.tasks.push({
            Name: $scope.modal.newtask,
            isChecked: false
        });
        $scope.closeAddTask();
        //$scope.newtask = "";
        LocalStorageService.setStorageList("task-1", $scope.tasks);

    };
    $ionicModal.fromTemplateUrl('templates/addtask.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Close the login modal
    $scope.closeAddTask = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $rootScope.showAddTask = function () {
        $scope.modal.newtask = '';
        $scope.modal.show();
    };
    //Delete checked item(s) and sync localstorage
    $scope.delete = function (index) {
        $scope.tasks = filterFilter($scope.tasks, function (task) {
            return !task.isChecked;
        });
        LocalStorageService.setStorageList("task-1", $scope.tasks);
    }

    //Tracking which item is checked so it can be deleted
    $scope.isChecked = function () {
        for (var e in $scope.tasks) {
            var listItem = $scope.tasks[e];
            if (listItem.isChecked) {
                return true;
            }
        }
        return false;
    };

    //A counter to count items to be deleted
    $scope.deleteAllSelected = function () {
        var counter = 0;
        angular.forEach($scope.tasks, function (task) {
            counter += task.isChecked ? 1 : 0;
        });
        return counter;
    };

    //Check if the item is checked
    $scope.setChecked = function (index) {
        //console.log($scope.tasks[index].isChecked);
        //vibration
        if ($scope.tasks[index].isChecked && $scope.vibe.isChecked) {
            //alert("Vibration");
            $cordovaVibration.vibrate(300);
        }

        //notification
        var count = 0;
        angular.forEach($scope.tasks, function (task) {
            if (task.isChecked) {
                count++;
            }
        });

        //if all items are checked, the app will send a notification
        if (count == $scope.tasks.length && $scope.notify.isChecked) {
            //alert("Notification");
            $cordovaLocalNotification.add({
                id: 'tasks_notification',
                title: "tasks List",
                Name: 'All tasks are selected to be deleted.'
            }).then(function () {
                console.log('notification fired');
            });
        }
    };

    //Delete one item when swiping rite
    $scope.deleteItem = function (task) {
        $scope.tasks.splice($scope.tasks.indexOf(task), 1);
    };
})

.controller('CompleteCtrl', function ($scope, $ionicModal, $rootScope, LocalStorageService, $cordovaVibration, $cordovaLocalNotification, filterFilter) {
    if (LocalStorageService.getStorageList("task-2")) {  
        $scope.completes = LocalStorageService.getStorageList("task-2");
    } else { 
        $scope.completes = [
            {
                Name: "Create the project",
                isChecked: true
            },
            {
                Name: "Configure Platforms",
                isChecked: true
            },
            {
                Name: "Test it out",
                isChecked: true
            },
            {
                Name: "Let’s go!",
                isChecked: true
            },
            {
                Name: "Starting your app",
                isChecked: true
            }
        ];
        LocalStorageService.setStorageList("task-2", $scope.completes);

    };

    //Add new items to the list and sync localstorage
    $scope.submitForm = function (isValid) {
        if (isValid) {
            $scope.completes.push({
                Name: $scope.modal.newcompletetask,
                isChecked: true
            });
            LocalStorageService.setStorageList("task-2", $scope.completes);
            $scope.newcomplete = "";
            $scope.closeAddCompleteTask();
        };
    }

    $ionicModal.fromTemplateUrl('templates/addcompletetask.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    //Close the login modal
    $scope.closeAddCompleteTask = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $rootScope.showAddCompleteTask = function () {
        $scope.modal.newcompletetask = '';
        $scope.modal.show();
    };
    //Delete checked item(s) and sync localstorage
    $scope.delete = function (index) {
        $scope.completes = filterFilter($scope.completes, function (complete) {
            return !complete.isChecked;
        });
        LocalStorageService.setStorageList("task-2", $scope.completes);
    }

    //Check if the item is checked
    $scope.isChecked = function () {
        for (var e in $scope.completes) {
            var listItem = $scope.completes[e];
            if (listItem.isChecked) {
                return true;
            }
        }
        return false;
    };

    //A counter to count items to be deleted
    $scope.deleteAllSelected = function () {
        var counter = 0;
        angular.forEach($scope.completes, function (complete) {
            counter += complete.isChecked ? 1 : 0;
        });
        return counter;
    };

    //Check if the item is checked
    $scope.setChecked = function (index) {
        //console.log($scope.tasks[index].isChecked);

        //vibration
        if ($scope.completes[index].isChecked && $scope.vibe.isChecked) {
            //alert("Vibration");
            $cordovaVibration.vibrate(300);
        }

        //notification
        var count = 0;
        angular.forEach($scope.completes, function (complete) {
            if (complete.isChecked) {
                count++;
            }
        });

        //if all items are checked, the app will send a notification
        if (count == $scope.completes.length && $scope.notify.isChecked) {
            //alert("Notification");
            $cordovaLocalNotification.add({
                id: 'completes_notification',
                title: "completes List",
                Name: 'All completes are selected to be deleted.'
            }).then(function () {
                console.log('notification fired');
            });
        }
    };

    //Delete one item when swiping rite
    $scope.deleteItem = function (complete) {
        $scope.completes.splice($scope.completes.indexOf(complete), 1);
    };
})


.controller('IncompleteCtrl', function ($scope,$ionicModal, $rootScope , LocalStorageService, $cordovaVibration, $cordovaLocalNotification, filterFilter) {
    if (LocalStorageService.getStorageList("task-3")) {
        $scope.incompletes = LocalStorageService.getStorageList("task-3");
    } else {
        $scope.incompletes = [
            {
                Name: "Starting your app",
                isChecked: false
            },
            {
                Name: "Simulator testing",
                isChecked: false
            },
             {
                 Name: "Mobile browser testing",
                 isChecked: false
             },
              {
                  Name: "Testing as a native app",
                  isChecked: false
              },
               {
                   Name: "Building it out",
                   isChecked: false
               }
        ];
        LocalStorageService.setStorageList("task-3", $scope.incompletes);

    };
    $ionicModal.fromTemplateUrl('templates/addincompletetask.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    //Close the login modal
    $scope.closeAddIncompleteTask = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $rootScope.showAddIncomplateTask = function () {
        $scope.modal.newincompletetask = '';
        $scope.modal.show();
    };
    //Add new items to the list and sync localstorage
    $scope.submitForm = function (isValid) {
        if (isValid) {
            $scope.incompletes.push({
                Name: $scope.modal.newincompletetask,
                isChecked: false
            });
            LocalStorageService.setStorageList("task-3", $scope.incompletes);
            $scope.newincompletetask = "";
            $scope.closeAddIncompleteTask();
        };
    }

    //Delete checked item(s) and sync localstorage
    $scope.delete = function (index) {
        $scope.incompletes = filterFilter($scope.incompletes, function (incomplete) {
            return !incomplete.isChecked;
        });
        LocalStorageService.setStorageList("task-3", $scope.incompletes);
    }

    //Tracking which item is checked so it can be deleted
    $scope.isChecked = function () {
        for (var e in $scope.incompletes) {
            var listItem = $scope.incompletes[e];
            if (listItem.isChecked) {
                return true;
            }
        }
        return false;
    };

    //counter to count how many items to be deleted
    $scope.deleteAllSelected = function () {
        var counter = 0;
        angular.forEach($scope.incompletes, function (complete) {
            counter += complete.isChecked ? 1 : 0;
        });
        return counter;
    };

    //Checked if the item is checked
    $scope.setChecked = function (index) {
        //console.log($scope.tasks[index].isChecked);

        //vibration
        if ($scope.incompletes[index].isChecked && $scope.vibe.isChecked) {
            //alert("Vibration");
            $cordovaVibration.vibrate(300);
        }

        //notification
        var count = 0;
        angular.forEach($scope.incompletes, function (incomplete) {
            if (incomplete.isChecked) {
                count++;
            }
        });

        //if all items are checked, the app will send a notification
        if (count == $scope.incompletes.length && $scope.notify.isChecked) {
            //alert("Notification");
            $cordovaLocalNotification.add({
                id: 'incompletes_notification',
                title: "incompletes List",
                Name: 'All incompletes are selected to be deleted.'
            }).then(function () {
                console.log('notification fired');
            });
        }
    };

    //Delete one item when swiping rite
    $scope.deleteItem = function (incomplete) {
        $scope.incompletes.splice($scope.incompletes.indexOf(incomplete), 1);
    };
})