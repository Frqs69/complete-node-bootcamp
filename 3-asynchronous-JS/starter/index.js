const fs = require("fs");
const superagent = require("superagent");

//call back hell
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
// 	console.log(`Breed: ${data}`);

// 	superagent
// 		.get(`https://dog.ceo/api/breed/${data}/images/random`)
// 		.end((err, res) => {
//             if(err) return console.log(err.message)
// 			console.log(res.body.message);

//             fs.writeFile('dog-img.txt', res.body.message, err => {
//                 console.log('Random dog img saved to file')
//             });
// 		});
// });

// consume promises
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
// 	console.log(`Breed: ${data}`);

// 	superagent
// 		.get(`https://dog.ceo/api/breed/${data}/images/random`)
// 		.then((res) => {
// 			console.log(res.body.message);

// 			fs.writeFile("dog-img.txt", res.body.message, (err) => {
// 				console.log("Random dog img saved to file");
// 			});
// 		}).catch((err) => {
//             console.log(err.message);
//         });
// });

//build promises
const readFilePro = (file) => {
	return new Promise((resolve, reject) => {
		fs.readFile(file, (err, data) => {
			if (err) reject("File not found");
			resolve(data);
		});
	});
};

const writeFilePro = (file, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, (err) => {
			if (err) reject("Cant write file");
			resolve("File created successfully");
		});
	});
};

// readFilePro(`${__dirname}/dog.txt`)
// 	.then((data) => {
// 		console.log(`Breed: ${data}`);

// 		return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
// 	})
// 	.then((res) => {
// 		console.log(res.body.message);

// 		return writeFilePro("dog-img.txt", res.body.message);
// 	})
// 	.then(() => {
// 		console.log("Random dog img saved to file");
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

// async/await
const getDogPic = async () => {
	try {
		const data = await readFilePro(`${__dirname}/dog.txt`);
		console.log(`Breed: ${data}`);

		const res1 =  superagent.get(
			`https://dog.ceo/api/breed/${data}/images/random`
		);
        const res2 =  superagent.get(
			`https://dog.ceo/api/breed/${data}/images/random`
		);
        const res3 =  superagent.get(
			`https://dog.ceo/api/breed/${data}/images/random`
		);
        
        const allImgs = await Promise.all([res1, res2, res3]);
        const imgs = allImgs.map(el => el.body.message);


		console.log(imgs);

		await writeFilePro("dog-img.txt", imgs.join("\n"),);

	} catch (err) {
        console.log(err)
    }
};

getDogPic();
