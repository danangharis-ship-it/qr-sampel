const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxJKtAp6dAKDj-9a--uJYScmdESG-4HZnb5AkpP3C8Zji0OBeOn_OUNeoLBmddRe3MhTw/exec";


export default async function handler(req, res) {

  // Supaya kita mudah mengetahui sumber error
  try {

    if (
      !APPS_SCRIPT_URL ||
      APPS_SCRIPT_URL.includes("MASUKKAN_URL")
    ) {

      return res.status(500).json({
        success: false,
        message:
          "URL Apps Script belum dimasukkan di api/sample.js"
      });

    }


    /*
     * ============================================
     * GET = CARI DATA SAMPEL
     * ============================================
     */

    if (req.method === "GET") {

      const uuid =
        String(
          req.query.uuid || ""
        ).trim();


      if (!uuid) {

        return res.status(400).json({
          success: false,
          message: "UUID kosong"
        });

      }


      const targetURL =
        APPS_SCRIPT_URL +
        "?action=getSample&uuid=" +
        encodeURIComponent(uuid);


      console.log(
        "Menghubungi Apps Script:",
        targetURL
      );


      const response =
        await fetch(targetURL, {
          method: "GET",
          redirect: "follow"
        });


      const text =
        await response.text();


      console.log(
        "Status Apps Script:",
        response.status
      );


      console.log(
        "Response Apps Script:",
        text
      );


      /*
       * Kalau Google mengembalikan error HTTP
       */

      if (!response.ok) {

        return res.status(502).json({

          success: false,

          message:
            "Apps Script HTTP " +
            response.status,

          detail:
            text.substring(0, 500)

        });

      }


      /*
       * Pastikan response Apps Script benar-benar JSON
       */

      let data;


      try {

        data =
          JSON.parse(text);

      }

      catch (error) {

        return res.status(502).json({

          success: false,

          message:
            "Apps Script tidak mengembalikan JSON",

          detail:
            text.substring(0, 500)

        });

      }


      /*
       * Teruskan response Apps Script
       */

      return res.status(200).json(data);

    }



    /*
     * ============================================
     * POST = SIMPAN DATA
     * ============================================
     */

    if (req.method === "POST") {

      const body =
        req.body || {};


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
              JSON.stringify(body)

          }
        );


      const text =
        await response.text();


      if (!response.ok) {

        return res.status(502).json({

          success: false,

          message:
            "Apps Script HTTP " +
            response.status,

          detail:
            text.substring(0, 500)

        });

      }


      let data;


      try {

        data =
          JSON.parse(text);

      }

      catch (error) {

        return res.status(502).json({

          success: false,

          message:
            "Response Apps Script bukan JSON",

          detail:
            text.substring(0, 500)

        });

      }


      return res.status(200).json(data);

    }



    return res.status(405).json({

      success: false,

      message:
        "Method tidak diizinkan"

    });


  }

  catch (error) {

    console.error(
      "VERCEL FUNCTION ERROR:",
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
