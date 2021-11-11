// const ConvertLib = artifacts.require("ConvertLib");
const Profiles = artifacts.require("Profiles");

module.exports = function (deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(Profiles);
};
