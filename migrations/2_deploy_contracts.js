const Profiles = artifacts.require("Profiles");
const Swipes = artifacts.require("Swipes");

module.exports = function (deployer) {
  deployer.deploy(Profiles);
  deployer.deploy(Swipes);
};
