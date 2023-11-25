const handleHelloWorld = (req, res) => {
    const cac = 'harhahaha'
    return res.render("CRUD.ejs", { cac })
}

module.exports = {
    handleHelloWorld
}