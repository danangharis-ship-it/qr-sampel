export default async function handler(req, res) {

  try {

    const { uuid } = req.query;

    if (!uuid) {
      return res.status(400).json({
        success: false,
        message: "UUID kosong"
      });
    }

    const APPS_SCRIPT_URL =
      "MASUKKAN_URL_APPS_SCRIPT_ANDA";

    const url =
      APPS_SCRIPT_URL +
      "?action=getSample&uuid=" +
      encodeURIComponent(uuid);


    const response = await fetch(url, {
      redirect: "follow"
    });


    const text = await response.text();

    console.log("Apps Script response:", text);


    let data;

    try {

      data = JSON.parse(text);

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Respons Apps Script bukan JSON",
        response: text
      });

    }


    return res.status(200).json(data);


  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }

}
