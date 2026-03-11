def compute_metrics(slides):

    slide_count = len(slides)

    total_words = 0
    total_images = 0

    for slide in slides:

        total_words += len(slide["content"].split())
        total_images += slide["image_count"]

    avg_words = 0

    if slide_count > 0:
        avg_words = total_words / slide_count

    return {
        "slide_count": slide_count,
        "avg_words_per_slide": avg_words,
        "image_count": total_images
    }