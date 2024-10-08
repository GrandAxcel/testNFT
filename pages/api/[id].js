import {INFURA_ADDRESS, ADDRESS, ABI} from "../../config.js"
import Web3 from "web3";

const fetch = require('node-fetch');
// import the json containing all metadata. not recommended, try to fetch the database from a middleware if possible, I use MONGODB for example
//import traits from "../../database/finaltraits.json";

const infuraAddress = INFURA_ADDRESS

const projectApi = async(req, res) => {

    // SOME WEB3 STUFF TO CONNECT TO SMART CONTRACT
    const provider = new Web3.providers.HttpProvider(infuraAddress)
    const web3infura = new Web3(provider);
    const nftContract = new web3infura.eth.Contract(ABI, ADDRESS)

    let traits;

    try {
      const apiResponse = await fetch(
        'https://gateway.pinata.cloud/ipfs/QmYQU1uVdEioAe25J2298rkepASXV32VBtip9i15bNNYho',
        );
      traits = await apiResponse.json();
      console.log(traits);
    } catch (err) {
      console.log(err);
      res.json({ error: 'Something went wrong' });
    }

  // IF YOU ARE USING INSTA REVEAL MODEL, USE THIS TO GET HOW MANY NFTS ARE MINTED
  const totalSupply = await nftContract.methods.totalSupply().call();
  console.log(totalSupply)
  


// THE ID YOU ASKED IN THE URL
const query = req.query.id;


  // IF YOU ARE USING INSTA REVEAL MODEL, UNCOMMENT THIS AND COMMENT THE TWO LINES BELOW
  if(parseInt(query) < totalSupply) {
    const totalNFT = 30;
  //if(parseInt(query) < totalNFT) {


    // CALL CUSTOM TOKEN NAME IN THE CONTRACT
    // const tokenNameCall = await nftContract.methods.nftNames(query).call();
    // let tokenName = `#${query}${(tokenNameCall === '') ? "" : ` - ${tokenNameCall}`}`

    // IF YOU ARE NOT USING CUSTOM NAMES, JUST USE THIS
    let tokenName= `#${query}`

    
    
    //const signatures = [137,883,1327,1781,2528,2763,3833,5568,5858,6585,6812,7154,8412]
    const trait = traits[parseInt(query)]
    //const trait = traits[ Math.floor(Math.random() * 8888) ] // for testing on rinkeby 

    // CHECK OPENSEA METADATA STANDARD DOCUMENTATION https://docs.opensea.io/docs/metadata-standards
    let metadata = {
      "name": tokenName,
      "description": "Test Description",
      "tokenId" : parseInt(query),
      "image": `https://gateway.pinata.cloud/ipfs/${trait["imageIPFS"]}`,
      "external_url":"https://test-nft-iota.vercel.app/",
      "attributes": [          
      {
        "trait_type": "Background",
        "value": trait["Background"]
      },
      {
        "trait_type": "Face",
        "value": trait["Face"]
      },
      {
        "trait_type": "Mouth",
        "value": trait["Mouth"]
      },
      {
        "trait_type": "Eyes",
        "value": trait["Eyes"]
      },
            // {
            //   "trait_type": "Head Gear",
            //   "value": trait["headgear"]
            // },

            ]
          }

          res.statusCode = 200
          res.json(metadata)
        } else {
          res.statuscode = 404
          res.json({error: "The NFT you requested is out of range"})

        }


  // this is after the reveal

  
}

export default projectApi