with import <nixpkgs> {};
let
  pkgs-6ec8fe0 = import (fetchGit {
    url = "https://github.com/NixOS/nixpkgs";
    rev = "6ec8fe0408d8940dcbeea6b01cab071062fd8f2d";
  }) {};
in
stdenv.mkDerivation {
  name = "klab-env";
  buildInputs = [
    autoconf
    bc
    flex
    utillinux
    gcc
    getopt
    git
    gmp
    gnumake
    jq
    maven
    mpfr
    ncurses
    nodejs-10_x
    opam
    openjdk8
    pandoc
    parallel
    pkgconfig
    python
    python3
    wget
    zip
    pkgs-6ec8fe0.z3
  ];
  shellHook = ''
    export PATH=$PWD/node_modules/.bin/:$PWD/bin:$PATH
    export KLAB_EVMS_PATH="''${KLAB_EVMS_PATH:-''${PWD}/evm-semantics}"
  '';
}
