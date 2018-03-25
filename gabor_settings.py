import cv2
import numpy as np

# Path of input
filename = 'arab.jpeg'

# show process
show_step = False


# Set Threshold 
threshold_min = 110

# Segmentation settings:
segment_kernel_size = 11

# Gabor settings:
gabor_directions = 6;
gabor_ksize = 45;
gabor_sigma = 2.0;
gabor_lambda = 6.8;
gabor_gamma = 0.09;
gabor_psi = 0.2;
gabor_ktype = cv2.CV_32F

# Final threshold
#threshold_min = 190-13.5*flatten_kernel_size # CHANGE FOR BETTER ACCUARCY
manipulate_gabor = True

# Size of Gaussian Blur kernel
gaussian_blur_size = 29

alpha= False