const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzUzXRfbm44xjlsboTttWF5IjQKMaM5M3byNrkydlPoCv_nQi_UU0RdvXXWaVNyzH38ow/exec";


export default async function handler(req, res) {

  // Selalu response JSON
  res.setHeader(
    "Content-Type",
    "application/json"
  );


  try {

    // =========================================
    // TEST ENDPOINT
    // =========================================

    if (req.method === "GET") {

      return res.status(200).json({
        success: true,
        message: "API Save Vercel aktif"
      });

    }


    // =========================================
    // HANYA IZINKAN POST
    // =========================================

    if (req.method !== "POST") {

      return res.status(405).json({
        success: false,
        message: "Method tidak diizinkan"
      });

    }


    // =========================================
    // CEK URL APPS SCRIPT
    // =========================================

    if (
      !APPS_SCRIPT_URL ||
      APPS_SCRIPT_URL.includes(
        "MASUKKAN_URL"
      )
    ) {

      return res.status(500).json({
        success: false,
        message:
          "URL Apps Script belum dikonfigurasi"
      });

    }


    // =========================================
    // DATA DARI INDEX.HTML
    // =========================================

    const data =
      req.body || {};


    console.log(
      "DATA DITERIMA:",
      data
    );


    if (!data.idSampel) {

      return res.status(400).json({
        success: false,
        message:
          "ID Sampel kosong"
      });

    }


    // =========================================
    // KIRIM KE APPS SCRIPT
    // =========================================

    const response =
      await fetch(

        APPS_SCRIPT_URL,

        {

          method: "POST",

          redirect: "follow",

          headers: {

            "Content-Type":
              "text/plain;charset=utf-8"

          },

          body:
            JSON.stringify(data)

        }

      );


    const text =
      await response.text();


    console.log(
      "STATUS APPS SCRIPT:",
      response.status
    );


    console.log(
      "RESPONSE APPS SCRIPT:",
      text
    );


    // =========================================
    // CEK APAKAH RESPONSE JSON
    // =========================================

    let result;


    try {

      result =
        JSON.parse(text);

    }

    catch(error) {

      return res.status(502).json({

        success: false,

        message:
          "Apps Script tidak mengembalikan JSON",

        detail:
          text.substring(0, 500)

      });

    }


    // =========================================
    // TERUSKAN RESPONSE
    // =========================================

    return res.status(200).json(result);


  }

  catch(error) {

    console.error(
      "SAVE ERROR:",
      error
    );


    return res.status(500).json({

      success: false,

      message:
        "Vercel server error",

      detail:
        error.message

    });

  }

}
