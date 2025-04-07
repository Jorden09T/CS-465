/* GET homepage */

const index = (req, res) => {
	res.render('index', { title: 'Trravlr Getawats' });
};

module.exports = {
	index
}