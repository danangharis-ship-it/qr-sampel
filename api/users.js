const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzUzXRfbm44xjlsboTttWF5IjQKMaM5M3byNrkydlPoCv_nQi_UU0RdvXXWaVNyzH38ow/exec";


export default async function handler(req, res) {

  res.setHeader(
    "Content-Type",
    "application/json"
  );


  try {

    if (req.method !== "GET") {

      return res.status(405).json({
        success: false,
        message: "Method tidak diizinkan"
      });

    }


    if (
      !APPS_SCRIPT_URL ||
      APPS_SCRIPT_URL.includes("MASUKKAN_URL")
    ) {

      return res.status(500).json({
        success: false,
        message: "URL Apps Script belum diisi"
      });

    }


    const response =
      await fetch(
        APPS_SCRIPT_URL +
        "?action=getUsers"
      );


    const text =
      await response.text();


    console.log(
      "APPS SCRIPT USERS:",
      text
    );


    let result;


    try {

      result =
        JSON.parse(text);

    } catch (error) {

      return res.status(502).json({

        success: false,

        message:
          "Apps Script tidak mengembalikan JSON",

        detail:
          text.substring(0, 500)

      });

    }


    return res.status(200).json(result);


  } catch (error) {

    console.error(error);


    return res.status(500).json({

      success: false,

      message:
        error.message

    });

  }

}
