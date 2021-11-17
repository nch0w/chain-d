// const ConvertLib = artifacts.require("ConvertLib");
const Profiles = artifacts.require("Profiles");
const Swipes = artifacts.require("Swipes");

module.exports = function (deployer) {
  // deployer.deploy(ConvertLib);
  // deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(Profiles);
  deployer.deploy(Swipes);
};
