//
// this script executes when you run 'yarn test'
//
// you can also test remote submissions like:
// CONTRACT_ADDRESS=0x43Ab1FCd430C1f20270C2470f857f7a006117bbb yarn test --network rinkeby
//
// you can even run mint commands if the tests pass like:
// yarn test && echo "PASSED" || echo "FAILED"
//
const {expect} = require("chai");

describe("🚩 Full POPP Token Flow", function () {
    this.timeout(120000);

    let myContract;
    // eslint-disable-next-line no-unused-vars
    let owner;
    let alice;
    let connie;
    let bob;
    let tokenId;

    // console.log("hre:",Object.keys(hre)) // <-- you can access the hardhat runtime env here

    describe("Popp Verification", function () {
        // `beforeEach` will run before each test, re-deploying the contract every
        // time. It receives a callback, which can be async.
        beforeEach(async function () {
            [owner, alice] = await ethers.getSigners();
            // deploy contract
            const POPPToken = await ethers.getContractFactory("POPPToken");
            myContract = await POPPToken.connect(owner).deploy();

            const balance0ETH = await myContract.balanceOf(owner.address);
            console.log("\t", " ⚖️ Starting Contract ETH balance: ", balance0ETH.toString());

        });

        describe("mintNewTokens()", function () {
            it("Should be able to mint new POPP tokens", async function () {
                await myContract.mint(alice.address, 10);

                const balance = await myContract.balanceOf(alice.address);
                expect(balance.toNumber()).to.be.equal(10);
            });

            it("Should revert if a non-owner tries to mint", async function () {
                await expect(
                    myContract.connect(alice).mint(alice.address, 10)
                ).to.be.revertedWith("Ownable: caller is not the owner");

                const balance = await myContract.balanceOf(alice.address);
                expect(balance.toNumber()).to.be.equal(0);
            });

            it("Should be able to pause the contract", async function () {
                await myContract.pause();
                await expect(
                    myContract.connect(owner).mint(alice.address, 10)
                ).to.be.revertedWith("Pausable: paused");

                await expect(
                    myContract.connect(owner).transfer(alice.address, 10)
                ).to.be.revertedWith("Pausable: paused");

                await myContract.unpause();
                await myContract.mint(alice.address, 10);
                const balance = await myContract.balanceOf(alice.address);
                expect(balance.toNumber()).to.be.equal(10);
            });

            it("Should be able to burn POPP tokens", async function () {
                await myContract.mint(alice.address, 10);
                await myContract.connect(alice).burn(5);
                const balance = await myContract.balanceOf(alice.address);
                expect(balance.toNumber()).to.be.equal(5);
            });
        });
    });
});
