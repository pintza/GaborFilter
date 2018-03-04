import cv2
import numpy as np

# Path of input
filename = 'arab.jpeg'

# show process
show_step = False

# Set Threshold
threshold_min = 120

# Segmentation settings:
segment_kernel_size = 15; # CHANGE FOR BETTER ACCUARCY

# Gabor settings:
gabor_directions = 6;
gabor_ksize = 35;
gabor_sigma = 2.0;
gabor_lambda = 6.8;
gabor_gamma = 0.09;
gabor_psi = 0.2;
gabor_ktype = cv2.CV_32F

# Size of Gaussian Blur kernel
# This needs to be an odd number.
gaussian_blur_size = 5

# Constants:
# Whether to show each gabor step.

# Sharpen_kernel
sharpen_kernel = 0.3*(np.array([[-1,-1,-1], [-1,11,-1], [-1,-1,-1]]))

# Final threshold
#threshold_min = 190-13.5*flatten_kernel_size # CHANGE FOR BETTER ACCUARCY
manipulate_gabor = True

# Final image settings
alpha = False

####
# rect format - x, y, w, h
# Top of file
#rect = (20,10,460,110) # need to get the coordinates from scribbles.
# Center
rect = (50,100,350,500) # need to get the coordinates from scribbles.
