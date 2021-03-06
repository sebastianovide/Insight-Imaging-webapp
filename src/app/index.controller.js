(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController($route,$window,$log,$location,firebaseService,messageService) {
    var vm = this;

    //vm.userAuthenticated = false;
    vm.authenticate = authenticate;
    vm.register = register;
    vm.logout = logout;

    $log.debug("IndexController constructor run userAuth="+vm.userAuth);
    vm.userAuth = firebaseService.auth.$getAuth();

    ////////
    function authenticate(){

      $log.debug("IndexController authenticate() run");

      firebaseService.auth.$authWithPassword({
        email    : vm.email,
        password : vm.password
      })
      .then(authHandler)
      .catch(authErrorHandler);
    }

    function authHandler(authData){
        $log.debug("IndexController authHandler called");
        vm.userAuth = authData;
    }

    function authErrorHandler(error){
        $log.debug("IndexController authErrorHandler called");
        messageService.error(error.message);
        vm.userAuth = false;
    }

    function register(){
      $log.debug("IndexController register() run");
      //var ref = new Firebase("https://insight-imaging-dev.firebaseio.com");

      firebaseService.auth.$createUser({
        email    : vm.email,
        password : vm.password
      })
      .then(registeredHandler)
      .catch(registerErrorHandler);

    }

    function registeredHandler(/*authData*/){
        vm.authenticate();
    }

    function registerErrorHandler(error){
        vm.userAuth = false;
        messageService.error(error.message);
    }

    function logout() {
      $log.debug("logout called");
          firebaseService.auth.$unauth();
          $window.location.reload();

    }

  }
})();
