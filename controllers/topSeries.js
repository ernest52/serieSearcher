module.exports = (req, res) => {
  let data = req.data;
  // data.sort();
  data = data.sort((a, b) => b.score - a.score);

  const subpage = "Top Series";

  res.render("subpage", { data, subpage });
};
