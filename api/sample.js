const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwnhWmRmP0F7nYc-PsIVyBBka6jrYWY_Ji5sSoJKdIzyKj1JJUWC-NyWz9W7sznwSA_Ww/exec";


export default async function handler(req, res) {

  try {

    if (req.method !== "POST") {

      return res.status(405).json({
        success: false,
        message: "Method tidak diizinkan"
      });

    }


    const data = req.body;


    const response = await fetch(
      APPS_SCRIPT_URL,
      {
        method: "POST",

        redirect: "follow",

        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },

        body: JSON.stringify(data)
      }
    );


    const text = await response.text();


    let result;

    try {

      result = JSON.parse(text);

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Apps Script tidak mengembalikan JSON",
        detail: text.substring(0, 500)
      });
    }


    return res.status(200).json(result);


  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
}
