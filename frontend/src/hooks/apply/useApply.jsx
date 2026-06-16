import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../../data-access/index";

/* 
   GET ALL APPLICATIONS
 */

export const useApplications = ({ status, search }) => {
  return useQuery({
    queryKey: ["applications", status, search],
    queryFn: () => getApplications({ status, search }),
  });
};

/* 
   GET SINGLE APPLICATION
 */

export const useApplication = (id) => {
  return useQuery({
    queryKey: ["application", id],

    queryFn: () => getApplicationById(id),

    enabled: !!id,
  });
};

/* 
   CREATE APPLICATION
 */

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApplication,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },
  });
};

/* 
   UPDATE APPLICATION
 */

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateApplication,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["application", variables.id],
      });
    },
  });
};

/* 
   DELETE APPLICATION
 */

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApplication,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },
  });
};
