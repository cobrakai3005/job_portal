import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../data-access/index";

/* 
   GET ALL LOCATIONS
 */

export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: getLocations,
  });
};

/* 
   GET SINGLE LOCATION
 */

export const useLocation = (locationId) => {
  return useQuery({
    queryKey: ["location", locationId],

    queryFn: () => getLocationById(locationId),

    enabled: !!locationId,
  });
};

/* 
   CREATE LOCATION
 */

export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLocation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
    },
  });
};

/* 
   UPDATE LOCATION
 */

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLocation,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });

      queryClient.invalidateQueries({
        queryKey: ["location", variables.locationId],
      });
    },
  });
};

/* 
   DELETE LOCATION
 */

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLocation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["locations"],
      });
    },
  });
};
