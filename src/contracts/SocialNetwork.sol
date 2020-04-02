pragma solidity ^0.5.0;
contract SocialNetwork{

    string public name;
    uint public postCount = 0;
    mapping(uint =>Post)public posts;
    struct Post{
        uint id;
        string content;
        uint tipAmount;
        address payable author;
    }

    event PostCreated(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );
        event PostTipped(
        uint id,
        string content,
        uint tipAmount,
        address payable author
    );
    constructor()public
    {
        name = "Dapp University social network";
    }
    function createPost(string memory _content)public
    {
        //run the failure 
        require(bytes(_content).length>0);
        //create the post
        postCount++;
        posts[postCount] = Post(postCount,_content,0,msg.sender);
        //Trigger the event to track  the post
        emit PostCreated(postCount,_content,0,msg.sender);
        
    }
    function TipPost(uint _id) public payable{
        //fail if id doesn't exists
        require(_id>0 && _id <= postCount);

        //Fetch the post
        Post memory _post= posts[_id];
        //fetch the author
        address payable _author=_post.author;
        //pay the author
        address (_author).transfer(msg.value);
        //Increment the tip AMount
        _post.tipAmount=_post.tipAmount + msg.value;
        //upgrade the posts
        posts[_id]=_post;
        //emit an event
        emit PostTipped(postCount,_post.content,_post.tipAmount,_author);
    }
}