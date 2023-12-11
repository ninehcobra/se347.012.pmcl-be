const handleHelloWorld = (req, res) => {
    const nineh = 'harhahaha'
    return res.render("CRUD.ejs", { nineh })
}

module.exports = {
    handleHelloWorld
}