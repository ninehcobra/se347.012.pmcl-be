// nodemailerConfig.js
const nodemailer = require('nodemailer');

const sendBidNotificationEmail = (userEmail, data) => {

    console.log(data)


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'giaohangle290302@gmail.com',
            pass: 'oqjyyhpjsrsdjpiu',
        },
    });

    const mailOptions = {
        from: '"NINEHBIDDING 👻" <giaohangle290302@gmail.com>',
        to: userEmail,
        subject: 'SẢN PHẨM BỊ VƯỢT ĐẤU GIÁ',
        html: `
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Thông báo sản phẩm bạn đang đấu giá đã bị người khác đấu giá cao hơn</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            }

                            .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            }

                            h1 {
                            font-size: 24px;
                            margin-top: 0;
                            color: #333;
                            }

                            p {
                            font-size: 16px;
                            color: #666;
                            }

                            .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight:bold;
                            }

                            .button:hover {
                            background-color: #0056b3;
                            color:white;
                            font-weight:bold;
                            }

                        </style>
                        </head>
                        <body>

    <h1>Cảm ơn bạn đã đấu giá sản phẩm ${data.name} bên chúng tôi!</h1>
    <p>Chúng tôi rất tiếc vì sản phẩm của bạn đang đấu giá đã bị vượt.</p>
    <p>Hãy kiểm tra email thường xuyên để cập nhật thông tin về cuộc đấu giá này.</p>
    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua <a href="mailto:giaohangle290302@gmail.com">giaohangle290302@gmail.com</a>.</p>
    <a class="button" href="http://localhost:3000/product/${data.id}">Đến sản phẩm đấu giá</a>
</body>
</html>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

const sendWinNotificationEmail = (userEmail, data) => {




    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'giaohangle290302@gmail.com',
            pass: 'oqjyyhpjsrsdjpiu',
        },
    });

    const mailOptions = {
        from: '"NINEHBIDDING 👻" <giaohangle290302@gmail.com>',
        to: userEmail,
        subject: 'ĐẤU GIÁ THÀNH CÔNG',
        html: `
        <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Thông báo sản phẩm bạn đang đấu giá đã bị người khác đấu giá cao hơn</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            }

                            .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 5px;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            }

                            h1 {
                            font-size: 24px;
                            margin-top: 0;
                            color: #333;
                            }

                            p {
                            font-size: 16px;
                            color: #666;
                            }

                            .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight:bold;
                            }

                            .button:hover {
                            background-color: #0056b3;
                            color:white;
                            font-weight:bold;
                            }

                        </style>
                        </head>
                        <body>

    <h1>Cảm ơn bạn đã đấu giá sản phẩm ${data.name} bên chúng tôi!</h1>
    <p>Chúng tôi rất vui vì bạn đã đấu giá sản phẩm thành công.</p>
    <p>Hãy nhanh chóng thanh toán để nhanh chóng nhận sản phẩm bạn nhé.</p>
    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua <a href="mailto:giaohangle290302@gmail.com">giaohangle290302@gmail.com</a>.</p>
    <a class="button" href="http://localhost:3000/myaccount/winningbid">Đến thanh toán</a>
</body>
</html>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

module.exports = {
    sendBidNotificationEmail,
    sendWinNotificationEmail
};
