# -*- coding: utf-8 -*-
# Keep imports according to lexical order (to avoid clones).
import colorsys
import cv2
import cv2.cv as cv
import Image
import maxflow
from matplotlib import pyplot as plt
import numpy as np
from PIL import Image
from pylab import *

# Our code.
from gabor_settings import *
from utility import *

# TODO:
# figure out good "segment kernel size."
# mush post-gabor results so segmentation could figure out the correct result.
# maybe segment on feature matrix itself?
# Work on a good threshold value so we could use it in segmentation. Currently
# can only work with grayscaled images.
# other pictures are less effective. maybe parameters should be a percentage of shape ?

# Create Gabor filter for each orientation.
def build_filters(directions):
    filters = []
    for theta in np.arange(0, np.pi, np.pi / directions):
        params = {
            'ksize': (gabor_ksize, gabor_ksize),
            'sigma': gabor_sigma,
            'theta': theta,
            'lambd': gabor_lambda,
             'psi' : gabor_psi,
            'gamma': gabor_gamma,
            'ktype': gabor_ktype
        }

        kern = cv2.getGaborKernel(**params)
        kern /= 1.1*kern.sum()
        filters.append((kern,params))
    return filters



def process(original_image, filters):
# Process the filter on a new hue image.
    results = []

    # Run each gabor filter.
    for kern,params in filters:
        # Apply Gabor filter
        edited_image = cv2.filter2D(original_image, cv2.CV_8UC3, kern)
        results.append(edited_image)
        if show_step:
            cv2.imshow('show', edited_image)
            cv2.waitKey(0)
    return results

def grab_cut(gabor_img, original_img, path):
    # Initialize mask for the grab cut - all zeros.
    final_mask = np.zeros(gabor_img.shape[:2], np.uint8)


    rects = [
        (0,0,300,100),
        (50,100,350,500),
    ]

    # For every rectangle we get from the path, do:
    for rect in rects:
        mask = np.zeros(gabor_img.shape[:2], np.uint8)
        bgdModel = np.zeros((1, 65), np.float64)
        fgdModel = np.zeros((1, 65), np.float64)

        # Use the feature matrix to create the actual masking.
        cv2.grabCut(gabor_img, mask, rect, bgdModel, fgdModel, 2, cv.GC_INIT_WITH_RECT)
        new_mask = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')

        # Add the new discovered mask.
        final_mask = (final_mask == 1) | (new_mask == 1)

    # Cut the image.
    cut_image = original_img * final_mask[:, :, np.newaxis]
    plt.imshow(cut_image), plt.show()




############## MAIN ###################
# Load image.
original_image = cv2.imread(filename)

# Gray scale
gray_original_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2GRAY)


# Negate image.
negated_image = cv2.bitwise_not(gray_original_image)

# Create gabor kernels.
filters = build_filters(gabor_directions)
filtered_images = process(negated_image, filters)
thresholds = [];

for filtered_image in filtered_images:

    # thicken the lines
    if manipulate_gabor:
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (segment_kernel_size, segment_kernel_size))
        grad = cv2.morphologyEx(filtered_image, cv2.MORPH_GRADIENT, kernel)
        _, threshold_image = cv2.threshold(grad, threshold_min, 0, cv2.THRESH_TOZERO)
        thresholds.append(threshold_image)
    else:
       thresholds.append(filtered_image)
    """
    if (show_step):
        cv2.imshow('show', threshold_image)
        cv2.waitKey(0)
    """
# Create feature matrix.
if alpha:
    channel_red = (thresholds[0] + thresholds[1]) / 2
    channel_green = (thresholds[2] + thresholds[3]) / 2
    channel_blue = (thresholds[4] + thresholds[5]) / 2
    channel_alpha = (thresholds[6] + thresholds[7]) / 2
    final = cv2.merge((channel_blue, channel_green, channel_red, channel_alpha))
else:
    channel_red = (thresholds[1] + thresholds[2]+thresholds[3]) / 3
    channel_green = (thresholds[4] + thresholds[5]+thresholds[6]) / 3
    channel_blue = (thresholds[7] + thresholds[0]) / 2
    final = cv2.merge((channel_blue, channel_green, channel_red))

# Gaussian blur for filling the gaps
final = cv2.GaussianBlur(final,(gaussian_blur_size, gaussian_blur_size), 0)


# Show feature matrix.
cv2.imshow('final', final)
cv2.waitKey(0)
# Grab Cut
#                                      (x, y, x+w, y+h)
#                           fore from scribble  back from scribble
grab_cut(final, original_image, rect)
