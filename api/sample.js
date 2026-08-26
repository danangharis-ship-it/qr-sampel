const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxJKtAp6dAKDj-9a--uJYScmdESG-4HZnb5AkpP3C8Zji0OBeOn_OUNeoLBmddRe3MhTw/exec";


export default async function handler(
  req,
  res
) {

  try {


    /*
     * GET
     * Cari data sampel
     */

    if (
      req.method ===
      "GET"
    ) {


      const uuid =
        String(
          req.query.uuid ||
          ""
        ).trim();


      if (!uuid) {

        return res
          .status(400)
          .json({

            success:
              false,

            message:
              "UUID kosong"

          });

      }


      const url =

        APPS_SCRIPT_URL +

        "?action=getSample&uuid=" +

        encodeURIComponent(
          uuid
        );


      const response =
        await fetch(
          url,
          {
            redirect:
              "follow"
          }
        );


      const text =
        await response.text();


      let data;


      try {

        data =
          JSON.parse(
            text
          );

      }


      catch(error) {

        return res
          .status(500)
          .json({

            success:
              false,

            message:
              "Response Apps Script bukan JSON",

            response:
              text

          });

      }


      return res
        .status(200)
        .json(
          data
        );

    }



    /*
     * POST
     * Simpan hasil scan
     */

    if (
      req.method ===
      "POST"
    ) {


      const body =
        req.body || {};


      const response =
        await fetch(

          APPS_SCRIPT_URL,

          {

            method:
              "POST",

            redirect:
              "follow",

            headers: {

              "Content-Type":
                "text/plain;charset=utf-8"

            },

            body:
              JSON.stringify(
                body
              )

          }

        );


      const text =
        await response.text();


      let data;


      try {

        data =
          JSON.parse(
            text
          );

      }


      catch(error) {

        return res
          .status(500)
          .json({

            success:
              false,

            message:
              "Response Apps Script bukan JSON",

            response:
              text

          });

      }


      return res
        .status(200)
        .json(
          data
        );

    }



    return res
      .status(405)
      .json({

        success:
          false,

        message:
          "Method tidak diizinkan"

      });


  }


  catch(error) {


    console.error(
      error
    );


    return res
      .status(500)
      .json({

        success:
          false,

        message:
          error.message

      });

  }

}
