from flask import Flask, render_template, request, send_file
import instaloader
import re
import os

app = Flask(__name__)
DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

def download_instagram_reel(url):
    pattern = r'(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:reel|reels)\/([a-zA-Z0-9_-]+)\/?'
    match = re.search(pattern, url)
    if not match:
        return None

    shortcode = match.group(1)
    loader = instaloader.Instaloader(
        quiet=True,
        download_pictures=False,
        download_videos=True,
        download_video_thumbnails=False,
        save_metadata=False
    )

    post = instaloader.Post.from_shortcode(loader.context, shortcode)
    loader.download_post(post, target=DOWNLOAD_FOLDER)

    for file in os.listdir(DOWNLOAD_FOLDER):
        if file.startswith(shortcode) and file.endswith(".mp4"):
            return os.path.join(DOWNLOAD_FOLDER, file)
    return None

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        url = request.form["url"]
        video_path = download_instagram_reel(url)
        if video_path:
            return send_file(video_path, as_attachment=True)
        else:
            return "❌ Invalid or private Instagram Reel URL."
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
