const SocialNetwork = artifacts.require("SocialNetwork"); 
require('chai')
.use(require('chai-as-promised'))
.should()

contract('SocialNetwork',([deployer , author, tipper])=>{

    let socialNetwork ;
    before(async()=>{
        socialNetwork =await SocialNetwork.deployed();
    });
    describe('deployment', async () => {
        it('deploys', async ()=>{
            const address=await socialNetwork.address ;
            assert.notEqual(address, 0*0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
            
        })
        it('has a name',async ()=>{
            const name=await socialNetwork.name();
            assert.equal(name , "Dapp University social network");
        })
    })

    describe('Posts',async () => {
        let result ,postCount;
        before(async()=>{
            result=await socialNetwork.createPost('this is it' ,{from: author});
            postCount=await socialNetwork.postCount();
        })
        it('createPosts',async()=>{
            //SUCCESS
            assert.equal(postCount,1);
            const event= await result.logs[0].args;
            assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct');
            assert.equal(event.content,'this is it','content is correct');
            assert.equal(event.tipAmount,'0','tipAmount is correct');
            assert.equal(event.author,author,'author is correct');
            //FAILURE
            await socialNetwork.createPost('' ,{from: author}).should.be.rejected;

        })
        it('lists posts',async()=>{
            const posts =await socialNetwork.posts(postCount);
            assert.equal(posts.id.toNumber(),postCount.toNumber(),'id is correct');
            assert.equal(posts.content,'this is it','content is correct');
            assert.equal(posts.tipAmount,'0','tipAmount is correct');
            assert.equal(posts.author,author,'author is correct');

        })


        it('postTipped',async()=>{
            //SUCCESS

            let oldAccountBalance;
            oldAccountBalance= await web3.eth.getBalance(author);
            oldAccountBalance=new web3.utils.BN(oldAccountBalance);

            result = await socialNetwork.TipPost(postCount,{from:tipper , value: web3.utils.toWei('1','Ether')});
            const event= await result.logs[0].args;
            assert.equal(event.id.toNumber(),postCount.toNumber(),'id is correct');
            assert.equal(event.content,'this is it','content is correct');
            assert.equal(event.tipAmount,'1000000000000000000','tipAmount is correct');
            assert.equal(event.author,author,'author is correct');


            let newAccountBalance;
            newAccountBalance= await web3.eth.getBalance(author);
            newAccountBalance=new web3.utils.BN(newAccountBalance);
            
            let tipAmount;
            tipAmount= web3.utils.toWei('1','Ether');
            tipAmount=new web3.utils.BN(tipAmount);

            const expectedAccountBalance=oldAccountBalance.add(tipAmount);
            assert.equal(newAccountBalance.toString(),expectedAccountBalance.toString());




            //FAILURE
            await socialNetwork.TipPost(99,
                {from:tipper , value: web3.utils.toWei('1','Ether')}).should.be.rejected;

        })
    })
    
    
})
